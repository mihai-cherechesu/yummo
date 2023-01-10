package cloud.fooddelivery.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cloud.fooddelivery.model.MyBody;
import cloud.fooddelivery.model.Order;
import cloud.fooddelivery.model.OrderEntry;
import cloud.fooddelivery.model.User;
import cloud.fooddelivery.service.OrderEntryService;
import cloud.fooddelivery.service.OrderService;
import cloud.fooddelivery.service.ProductService;
import cloud.fooddelivery.service.UserService;
import cloud.fooddelivery.dto.BasketProductDto;
import cloud.fooddelivery.dto.OrderClientDto;
import cloud.fooddelivery.dto.OrderCourierDto;
import cloud.fooddelivery.dto.OrderDto;
import cloud.fooddelivery.dto.OrderMergedDto;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@CrossOrigin
@RequestMapping("/orders/")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderEntryService orderEntryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final Logger LOGGER = LogManager.getLogger(OrderController.class);

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        if (orderService.getAll().isEmpty()){
            LOGGER.warn("Order list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Orders retreived successfully.");
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/optimized")
    public ResponseEntity<List<Order>> getAllOptimized(@RequestBody String city) {
        if (orderService.getAllByCity(city).isEmpty()) {
            LOGGER.warn("Order list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Orders retreived successfully.");
        return ResponseEntity.ok(orderService.getAllByCity(city));
    }

    @GetMapping("{id}")
    public ResponseEntity<Order> getById(@PathVariable("id") Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            LOGGER.error("Order #" + id + "not found.");
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("Order #" + id + " found.");
        return ResponseEntity.ok(order);
    }

    @CrossOrigin(origins = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/")
    @GetMapping("client/{email}")
    public ResponseEntity<?> getClientOrders(@PathVariable("email") String email) {
        User client = userService.getByEmail(email);
        if (client == null) {
            LOGGER.error("User with email " + email + " not found!");
            return new ResponseEntity<>("User " + email + " not found", HttpStatus.NOT_FOUND);
        }

        List<OrderClientDto> clientOrders = orderService.getClientOrders(email);
        List<OrderMergedDto> mergedOrders = new ArrayList<>();

        Map<Long, List<OrderClientDto>> ordersMap =
        clientOrders.stream().collect(Collectors.groupingBy(OrderClientDto::getOrder_number));

        for (Long key : ordersMap.keySet()) {
            List<OrderClientDto> orders = ordersMap.get(key);
            
            if (orders.isEmpty()) {
                continue;
            }

            String products = "";
            OrderMergedDto mergedOrder =  new OrderMergedDto();
            mergedOrder.setOrder_number(orders.get(0).getOrder_number());
            mergedOrder.setName(orders.get(0).getName());
            mergedOrder.setAddress(orders.get(0).getAddress());
            mergedOrder.setPhone_number(orders.get(0).getPhone_number());
            mergedOrder.setStatus(orders.get(0).getStatus());

            for (OrderClientDto o : orders) {
                products += o.getProduct_name() + " x " + o.getQuantity() + ", ";
            }

            mergedOrder.setProducts(products);
            mergedOrders.add(mergedOrder);
        }

        return ResponseEntity.ok(mergedOrders);
    }

    @CrossOrigin(origins = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/")
    @GetMapping("courier/{email}")
    public ResponseEntity<?> getCourierOrders(@PathVariable("email") String email) {
        User client = userService.getByEmail(email);
        if (client == null) {
            LOGGER.error("User with email " + email + " not found!");
            return new ResponseEntity<>("User " + email + " not found", HttpStatus.NOT_FOUND);
        }

        List<OrderCourierDto> courierOrders = orderService.getCourierOrders(email);
        List<OrderMergedDto> mergedOrders = new ArrayList<>();

        Map<Long, List<OrderCourierDto>> ordersMap =
        courierOrders.stream().collect(Collectors.groupingBy(OrderCourierDto::getOrder_number));

        for (Long key : ordersMap.keySet()) {
            List<OrderCourierDto> orders = ordersMap.get(key);
            
            if (orders.isEmpty()) {
                continue;
            }

            String products = "";
            OrderMergedDto mergedOrder =  new OrderMergedDto();
            mergedOrder.setOrder_number(orders.get(0).getOrder_number());
            mergedOrder.setName(orders.get(0).getName());
            mergedOrder.setAddress(orders.get(0).getAddress());
            mergedOrder.setPhone_number(orders.get(0).getPhone_number());
            mergedOrder.setStatus(orders.get(0).getStatus());

            for (OrderCourierDto o : orders) {
                products += o.getProduct_name() + " x " + o.getQuantity() + ", ";
            }

            mergedOrder.setProducts(products);
            mergedOrders.add(mergedOrder);
        }

        return ResponseEntity.ok(mergedOrders);
    }

    @PostMapping
    public ResponseEntity<Object> placeOrder(@RequestBody OrderDto item) {

        User client = userService.getByEmail(item.getClientEmail());
        if (client == null) {
            LOGGER.error("User with email " + item.getClientEmail() + " not found!");
            return new ResponseEntity<>("User " + item.getClientEmail() + " not found", HttpStatus.NOT_FOUND);
        }
        
        Order order = new Order();
        order.setCreatedAt(new Date());
        order.setStatus("Pending");
        order.setCity(client.getCurrentCity());
        order.setAddress(client.getAddress());
        order.setClientEmail(item.getClientEmail());
        order.setCourierEmail(null);

        order = orderService.create(order);
        LOGGER.info("Order placed; searching products...");

        for(BasketProductDto product : item.getProducts()) {
            if (!productService.existsById(product.getId())) {
                LOGGER.error("Product '" + product.getId() + "' does not exist; cancelling order.");
                orderService.delete(order);
                return new ResponseEntity<>("Product " + product.getId() + " not found", HttpStatus.NOT_FOUND);
            }

            OrderEntry entry = new OrderEntry();
            entry.setOrder(order);
            entry.setProduct(productService.getById(product.getId()));
            entry.setQuantity(product.getCount());
            entry = orderEntryService.add(entry);
            order.addEntry(entry);
        }
        
        this.kafkaTemplate.send("transaction-1", MyBody
            .builder()
            .toEmail(item.getClientEmail())
            .subject("Order placed")
            .text("Your order was successfully placed, all products have been found.")
            .build()
        );

        LOGGER.info("All products have been found; order placed successfully.");
        return ResponseEntity.ok(order);
    }

    @CrossOrigin(origins = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/")
    @PutMapping("accept/{id}")
    public ResponseEntity<Order> acceptOrder(@PathVariable Long id, @RequestBody String email) {
        Order order = orderService.updateOrderStatus(id, "Preparing");
        order.setCourierEmail(email);
        order = orderService.update(order);

        this.kafkaTemplate.send("transaction-1", MyBody
            .builder()
            .toEmail(order.getClientEmail())
            .subject("Order accepted")
            .text("Your order was accepted.")
            .build()
        );

        LOGGER.info("Order successfully accepted.");
        return ResponseEntity.ok(order);
    }

    @CrossOrigin(origins = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/")
    @PutMapping("update/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            LOGGER.error("Order #" + id + "not found.");
            return ResponseEntity.notFound().build();
        }
        Map<String, String> statusMap = new HashMap<String, String>();
        statusMap.put("Preparing", "Delivering");
        statusMap.put("Delivering", "Finished");
    
        if (!statusMap.containsKey(order.getStatus())) {
            LOGGER.error("Order status is not a valid value.");
            return ResponseEntity.internalServerError().build();
        }

        String oldStatus = order.getStatus();
        String newStatus = statusMap.get(order.getStatus());
        order = orderService.updateOrderStatus(id, newStatus);

        this.kafkaTemplate.send("transaction-1", MyBody
            .builder()
            .toEmail(order.getClientEmail())
            .subject("Order update")
            .text(String.format("Your order status was updated from \"%s\" to \"%s\".", oldStatus, newStatus))
            .build()
        );

        LOGGER.info("Order status successfully updated.");
        return ResponseEntity.ok(order);
    }
}
