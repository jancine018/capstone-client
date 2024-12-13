import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OrderConfirmationPage = () => {
  // Placeholder order details for the confirmation
  const orderDetails = {
    order_id: 12345,
    product_name: 'Sample Product',
    product_image: 'http://192.168.1.8/dbapp/sample-product.jpg', // Placeholder image URL
    total_price: 49.99,
    payment_method: 'Cash on Delivery', // Or Gcash based on previous selection
  };

  const handleContinueShopping = () => {
    // Navigate to the shopping page (implement navigation logic here)
  };

  const handleViewOrderHistory = () => {
    // Navigate to the order history page (implement navigation logic here)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Confirmation</Text>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: orderDetails.product_image }} style={styles.productImage} />
        <Text style={styles.productName}>{orderDetails.product_name}</Text>
        <Text style={styles.orderIdText}>Order ID: {orderDetails.order_id}</Text>
        <Text style={styles.totalPriceText}>Total Price: ${orderDetails.total_price.toFixed(2)}</Text>
        <Text style={styles.paymentMethodText}>Payment Method: {orderDetails.payment_method}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinueShopping}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleViewOrderHistory}>
          <Text style={styles.buttonText}>View Order History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for total price
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderConfirmationPage;
