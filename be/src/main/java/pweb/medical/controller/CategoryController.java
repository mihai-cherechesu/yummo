package pweb.medical.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pweb.medical.model.Category;
import pweb.medical.service.CategoryService;

@RestController
@CrossOrigin
@RequestMapping("/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;

    private static final Logger LOGGER = LogManager.getLogger(CategoryController.class);

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        if (categoryService.getAll().isEmpty()) {
            LOGGER.warn("Category list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Categories retreived successfully.");
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> getAllAsList() {
        if (categoryService.getAll().isEmpty()){
            LOGGER.warn("Category list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Category names retreived successfully.");
        return ResponseEntity.ok(
            categoryService
                .getAll()
                .stream()
                .map(c -> c.getName())
                .collect(Collectors.toList())
            );
    }

    @GetMapping("/{name}")
    public ResponseEntity<Category> getByName(@PathVariable String name) {
        Category category = categoryService.findByName(name);
        if (category == null) {
            LOGGER.error("Category '" + name + "' not found");
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("Category '" + name + "' found.");
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<Category> add(@RequestBody Category item) {
        try {
            Category category = categoryService.create(item);
            LOGGER.info("Category '" + item.getName() + "' added.");
            return new ResponseEntity<>(category, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.info("Could not add category '" + item.getName() + "'.");
            return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
        }
    }
}
