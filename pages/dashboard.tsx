import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

// Define the Dashboard component
const Dashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [products, setProducts] = useState([]); // State to store products
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading background
  const menuAnim = useRef(new Animated.Value(0)).current; // For menu animation

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.1.8/dbapp/products.php'); // Adjust URL as necessary
        setProducts(response.data); // Assuming the response data is an array of products
        console.log('Fetched products:', response.data); // Log the products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Render each product item
  const renderProduct = ({ item }: { item: any }) => {
    const imageURL = `http://192.168.1.8/dbapp/${item.image_url}`; // Full URL for the image

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('ProductDetails', { product: item })} // Pass the item
      >
        <Image 
          source={{ uri: imageURL }} 
          style={styles.image} 
          onError={() => console.error('Failed to load image:', imageURL)}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.base_price}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  // Function to handle FAB press
  const handleFabPress = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      // Open menu
      setIsMenuOpen(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Function to close the menu
  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsMenuOpen(false));
  };

  // Static menu items
  const menuItems = [
    { id: '1', name: 'Add Gadget' },
    { id: '2', name: 'View All Gadgets' },
    { id: '3', name: 'Settings' },
  ];

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        <Text style={styles.header}>Gadget Store</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.product_id.toString()} // Use product_id as key
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        />

        {/* Dimmed Background Overlay */}
        {isMenuOpen && (
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Circular Menu */}
        {isMenuOpen && (
          <Animated.View style={[styles.menuContainer, { opacity: menuAnim }]}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => console.log(item.name)}>
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles for the dashboard
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200, // Adjust height for better visibility
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Shadow effect
  },
  fabText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1, // Ensure the overlay is above other content
  },
  menuContainer: {
    position: 'absolute',
    bottom: 100, // Adjust this to place the menu above the FAB
    right: 30,
    alignItems: 'center',
    zIndex: 2, // Ensure the menu is above the overlay
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 3,
    marginBottom: 10,
    width: 120, // Adjust width as needed
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default Dashboard;
