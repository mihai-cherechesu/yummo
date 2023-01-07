package pweb.medical.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pweb.medical.model.User;
import pweb.medical.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void deleteById(Long id) {
        userRepository.delete(userRepository.getById(id));
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public void update(String email, User user) {
        userRepository.updateByEmail(
            email,
            user.getFirstName(),
            user.getLastName(),
            user.getPhoneNumber(),
            user.getCurrentCity(),
            user.getAddress());
    }
}
