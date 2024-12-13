import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

interface CartItem {
  cart_id: number;
  product_id: number;
  variant_id: number; // Include variant_id if needed
  quantity: number;
  name?: string; // Renamed from product_name to name
  image_url?: string; // Renamed from product_image to image_url
  variant_name?: string; // New field for variant name
  total_price?: number; // New field for total price
}

const CartPage = () => {
  const navigation = useNavigation(); // Get the navigation object
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isEditing, setIsEditing] = useState(false); // State to control showing delete button

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://192.168.1.8/dbapp/addtocart.php?user_id=1'); // Replace user_id dynamically if needed
        console.log('Fetched cart items:', response.data); // Log the response data
        if (response.data.success) {
          setCartItems(response.data.data); // Set cart items if the response is successful
        } else {
          setError(response.data.message); // Set error message from response
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items'); // Set error state
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchCartItems();
  }, []);

  const handleDeleteItem = async (cartId: number) => {
    try {
      await axios.delete(`http://192.168.1.8/dbapp/deletecart.php?cart_id=${cartId}`);
      // After deletion, refetch the cart items
      setCartItems(cartItems.filter(item => item.cart_id !== cartId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: `http://192.168.1.8/dbapp/${item.image_url}` }} 
        style={styles.productImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name || 'Product Name Not Available'}</Text>
        <Text style={styles.variantName}>{item.variant_name || 'Variant Not Available'}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.price}>Price: ${(item.total_price || 0 * item.quantity).toFixed(2)}</Text>
        
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item.cart_id)}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>; // Show loading state
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>; // Show error if any
  }

  if (cartItems.length === 0) {
    return <Text style={styles.emptyText}>Your cart is empty.</Text>; // Handle empty cart state
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Cart</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(prevState => !prevState)} // Toggle editing mode
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.cart_id.toString()}
        contentContainerStyle={styles.list}
      />
      
      {/* Proceed to Checkout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigation.navigate('PlaceOrder')} // Navigate to PlaceOrderPage
        >
          <Text style={styles.orderButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16, // Ensuring consistent width
    borderRadius: 5,
    marginTop: 10,
    width: 100, // Fixed width
    height: 40, // Fixed height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  variantName: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  quantity: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16, // Add some margin for spacing
    paddingHorizontal: 16,
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  orderButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartPage;
