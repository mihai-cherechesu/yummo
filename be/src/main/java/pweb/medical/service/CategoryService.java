package pweb.medical.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pweb.medical.model.Category;
import pweb.medical.repository.CategoryRepository;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category findByName(String name) {
        return categoryRepository.findByName(name).orElse(null);
    }

    public void deleteById(Long id) {
        categoryRepository.delete(categoryRepository.getById(id));
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }
}
