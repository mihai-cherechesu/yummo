package cloud.fooddelivery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import cloud.fooddelivery.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsById(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.firstName = :firstName, u.lastName = :lastName, u.phoneNumber = :phoneNumber, u.currentCity = :currentCity, u.address = :address WHERE u.email = :email")
    void updateByEmail(String email, String firstName, String lastName, String phoneNumber, String currentCity, String address);
}
