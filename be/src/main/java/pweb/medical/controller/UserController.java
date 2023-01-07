package pweb.medical.controller;

import java.util.List;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pweb.medical.model.User;
import pweb.medical.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin
class UserController {

    @Autowired
    private UserService userService;

    private static final Logger LOGGER = LogManager.getLogger(UserController.class);

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        if (userService.getAll().isEmpty()) {
            LOGGER.warn("User list is empty.");
            return ResponseEntity.noContent().build();
        }
        LOGGER.info("Users retreived successfully.");
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable("id") Long id) {       
        User user = userService.getById(id);
        if (user == null){
            LOGGER.error("User #" + id + "not found.");
            return ResponseEntity.notFound().build();
        }
        
        LOGGER.info("User #" + id + " found.");
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {       
        User user = userService.getByEmail(email);
        if (user == null){
            LOGGER.error("User " + email + " not found.");
            return ResponseEntity.notFound().build();
        }
        
        LOGGER.info("User " + email + " found.");
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User item) {
        try {
            User user = userService.create(item);
            LOGGER.info("User successfully added.");
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.error("Could not add user.");
            return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> update(@PathVariable("email") String email,
                                       @RequestBody User item) {
        User user = userService.getByEmail(email);
        if (user == null) {
            LOGGER.error("User " + email + "not found.");
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("User " + email + "updated.");
        userService.update(email, item);
        return new ResponseEntity<>("User " + email + "updated.",
            HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
        try {
            userService.deleteById(id);
            LOGGER.info("User " + id + " deleted.");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("User #" + id + "not found.");
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }
}