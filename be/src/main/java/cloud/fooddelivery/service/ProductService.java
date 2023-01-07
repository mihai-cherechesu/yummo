package cloud.fooddelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cloud.fooddelivery.model.Product;
import cloud.fooddelivery.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product findByName(String name) {
        return productRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    public List<Product> getAllProductsByCategories(List<String> categoryNames) {
        List<Product> fullProductList = productRepository.findAll();

        if (categoryNames == null || categoryNames.isEmpty()) {
            return fullProductList;
        }
        
        List<Product> result = new ArrayList<>();
        
        for (Product product : fullProductList) {
            for (String c : categoryNames) {
                if (product.containsCategory(c)) {
                    result.add(product);
                    break;
                }
            }
        }

        return result;
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Product product) {
        return productRepository.save(product);
    }
}
