package com.onlinebookstore.config;

import com.onlinebookstore.model.User;
import com.onlinebookstore.model.Book;
import com.onlinebookstore.repository.UserRepository;
import com.onlinebookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        }

        if (bookRepository.count() == 0) {
            List<Book> books = Arrays.asList(
                new Book("The Great Gatsby", "F. Scott Fitzgerald", 10.99, "A classic novel set in the Jazz Age.", "Fiction"),
                new Book("To Kill a Mockingbird", "Harper Lee", 8.99, "A novel about racial injustice in the Deep South.", "Fiction"),
                new Book("1984", "George Orwell", 9.99, "A dystopian novel about totalitarianism.", "Science Fiction"),
                new Book("A Brief History of Time", "Stephen Hawking", 15.99, "An overview of cosmology and black holes.", "Science"),
                new Book("The Art of War", "Sun Tzu", 7.99, "An ancient Chinese military treatise.", "Philosophy")
            );
            bookRepository.saveAll(books);
            System.out.println("Sample books have been added to the database.");
        }
    }
}
