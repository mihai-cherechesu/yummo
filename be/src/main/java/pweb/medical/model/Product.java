package pweb.medical.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Product")
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Getter @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter @Setter
    @Column(name = "name", unique = true)
    private String name;

    @Getter @Setter
    @Column(name = "status")
    private String status;

    @Getter @Setter
    @Column(name = "photo_url")
    private String photoURL;

    @Getter @Setter
    @Column(name = "left_stock")
    private Integer leftStock;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "product_categories",
        joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id")
    )
    private List<Category> categories = new ArrayList<>();

    @Getter @Setter
    @OneToMany(targetEntity = OrderEntry.class, mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderEntry> orders = new ArrayList<>();

    public List<String> getCategoryNames() {
        return this.categories
            .stream()
            .map(c -> c.getName())
            .collect(Collectors.toList());
    }

    @JsonIgnore
    public boolean containsCategory(String categoryName) {
        return this.getCategoryNames().contains(categoryName);
    }

    @JsonIgnore
    public void addCategory(Category category) {
        this.categories.add(category);
    }

    @JsonIgnore
    public void flushCategories() {
        this.categories.clear();
    }

    public Integer getOrderCount() {
        return this.orders.size();
    }
}
