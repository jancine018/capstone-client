import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const PlaceOrderPage = () => {
  const navigation = useNavigation(); // Initialize navigation
  // Placeholder order details
  const orderDetails = {
    order_id: 12345,
    product_id: 1,
    product_name: 'Sample Product',
    product_image: 'http://192.168.1.8/dbapp/sample-product.jpg', // Placeholder image URL
    quantity: 2,
    total_price: 49.99,
  };

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash'>('cod');

  const handlePaymentSelection = (method: 'cod' | 'gcash') => {
    setPaymentMethod(method);
  };

  const handleConfirmOrder = () => {
    // Here, you can add the API call to confirm the order.

    // After confirming the order, navigate to the Order Confirmation page.
    navigation.navigate('OrderConfirmationPage'); // Replace with your actual route name
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Order Summary</Text>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: orderDetails.product_image }} style={styles.productImage} />
          <Text style={styles.productName}>{orderDetails.product_name}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.quantityText}>Quantity: {orderDetails.quantity}</Text>
            <Text style={styles.totalPriceText}>Total Price: ${orderDetails.total_price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentHeader}>Select Payment Method:</Text>
          <TouchableOpacity
            style={[styles.paymentButton, paymentMethod === 'cod' && styles.selectedPayment]}
            onPress={() => handlePaymentSelection('cod')}
          >
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentButton, paymentMethod === 'gcash' && styles.selectedPayment]}
            onPress={() => handlePaymentSelection('gcash')}
          >
            <Text style={styles.paymentText}>Gcash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Order Button at Bottom */}
      <TouchableOpacity style={styles.orderButton} onPress={handleConfirmOrder}>
        <Text style={styles.orderButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light gray background for modern look
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80, // Add padding to accommodate the button
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
    marginVertical: 8,
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
  detailsContainer: {
    marginTop: 10,
  },
  quantityText: {
    fontSize: 16,
    color: '#666',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for total price
  },
  paymentContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  paymentButton: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPayment: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9', // Light green background for selected payment
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto', // Ensure the button is at the bottom
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  orderButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PlaceOrderPage;
