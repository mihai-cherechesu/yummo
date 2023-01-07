package cloud.fooddelivery.controller;

import java.util.List;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cloud.fooddelivery.dto.ProductDto;
import cloud.fooddelivery.model.Product;
import cloud.fooddelivery.service.CategoryService;
import cloud.fooddelivery.service.ProductService;

@RestController
@CrossOrigin
@RequestMapping("/products/")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    private static final Logger LOGGER = LogManager.getLogger(ProductController.class);

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        if (productService.getAll().isEmpty()) {
            LOGGER.warn("Product list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Products retreived successfully.");
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getById(@PathVariable("id") Long id) {
        Product product = productService.getById(id);
        if (product == null) {
            LOGGER.error("Product #" + id + "not found.");
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("Product #" + id + " found.");
        return ResponseEntity.ok(product);
    }

    @PostMapping("search")
    public ResponseEntity<List<Product>> getByCategory(@RequestBody List<String> categoryNames) {
        return ResponseEntity.ok(productService.getAllProductsByCategories(categoryNames));
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody ProductDto item) {
        Product product = new Product();
        product.setName(item.getName());
        product.setPhotoURL(item.getPhotoURL());
        product.setStatus(item.getStatus());
        product.setLeftStock(item.getLeftStock());

        for (String category : item.getCategoryNames())
            product.addCategory(categoryService.findByName(category));
        product = productService.create(product);

        LOGGER.info("Product successfully added.");
        return ResponseEntity.ok(productService.create(product));
    }

    @PutMapping("{id}")
    public ResponseEntity<Product> update(@PathVariable("id") Long id, @RequestBody ProductDto item) {
        Product product = productService.getById(id);
        if (product == null) {
            LOGGER.error("Product #" + id + "not found.");
            return ResponseEntity.notFound().build();
        }
            product.setName(item.getName());
            product.setPhotoURL(item.getPhotoURL());
            product.setStatus(item.getStatus());
    
            product.flushCategories();
            for (String category : item.getCategoryNames())
                product.addCategory(categoryService.findByName(category));
            
            LOGGER.info("Product #" + id + "updated.");
            return ResponseEntity.ok(productService.update(product));
    }
}
