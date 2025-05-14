package com.onlinebookstore.service;

import com.onlinebookstore.model.Book;
import com.onlinebookstore.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllBooks_ReturnsList() {
        List<Book> books = Arrays.asList(
                new Book("Title1", "Author1", 10.0, "Desc1", "Category1"),
                new Book("Title2", "Author2", 20.0, "Desc2", "Category2")
        );
        when(bookRepository.findAll()).thenReturn(books);

        List<Book> result = bookService.getAllBooks();

        assertEquals(2, result.size());
        verify(bookRepository).findAll();
    }

    @Test
    void getBookById_Found() {
        Book book = new Book("Title1", "Author1", 10.0, "Desc1", "Category1");
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Optional<Book> result = bookService.getBookById(1L);

        assertTrue(result.isPresent());
        assertEquals("Title1", result.get().getTitle());
    }

    @Test
    void getBookById_NotFound() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Book> result = bookService.getBookById(1L);

        assertFalse(result.isPresent());
    }

    @Test
    void searchBooksByTitle_ReturnsList() {
        List<Book> books = Arrays.asList(
                new Book("Java Programming", "Author1", 15.0, "Desc1", "Programming")
        );
        when(bookRepository.findByTitleContainingIgnoreCase("Java")).thenReturn(books);

        List<Book> result = bookService.searchBooksByTitle("Java");

        assertEquals(1, result.size());
        verify(bookRepository).findByTitleContainingIgnoreCase("Java");
    }

    @Test
    void filterBooksByCategory_ReturnsList() {
        List<Book> books = Arrays.asList(
                new Book("Title1", "Author1", 10.0, "Desc1", "Fiction")
        );
        when(bookRepository.findByCategoryIgnoreCase("Fiction")).thenReturn(books);

        List<Book> result = bookService.filterBooksByCategory("Fiction");

        assertEquals(1, result.size());
        verify(bookRepository).findByCategoryIgnoreCase("Fiction");
    }

    @Test
    void saveBook_Success() {
        Book book = new Book("Title1", "Author1", 10.0, "Desc1", "Category1");
        when(bookRepository.save(ArgumentMatchers.any(Book.class))).thenReturn(book);

        Book result = bookService.saveBook(book);

        assertNotNull(result);
        assertEquals("Title1", result.getTitle());
        verify(bookRepository).save(book);
    }
}
