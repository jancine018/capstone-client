import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Variant {
  variant_id: number;
  variant_name: string;
  additional_price: number;
  stock_quantity: number;
  image_url: string;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  variants: Variant[];
}

const ProductDetailsPage = ({ productId }: { productId: number }) => {
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);  // Set loading state before fetching data
        const response = await axios.get(`http://192.168.1.8/dbapp/products.php?id=${productId}`);
        if (response.data.length > 0) {
          const fetchedProduct = response.data[0];
          setProduct({
            ...fetchedProduct,
            base_price: Number(fetchedProduct.base_price),
          });
        } else {
          setError('No product found with the provided ID.');
        }
      } catch (error) {
        setError('Error fetching product details.');
      } finally {
        setLoading(false);  // Reset loading state after fetch
      }
    };

    fetchProductDetails();
  }, [productId]);  // Re-run the effect when productId changes

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = Number(product.base_price);
    const variantPrice = selectedVariant ? Number(selectedVariant.additional_price) : 0;
    return (basePrice + variantPrice) * quantity;
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://192.168.1.8/dbapp/addcart.php', {
        user_id: 1, // Replace with the actual logged-in user ID
        product_id: product?.product_id,
        variant_id: selectedVariant?.variant_id || null,
        quantity: quantity,
      });

      if (response.data.success) {
        alert('Product added to cart');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error adding product to cart');
    }
  };

  const handlePlaceOrder = () => {
    navigation.navigate('PlaceOrder', { product, selectedVariant, quantity });
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#2196F3" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!product) {
    return <Text style={styles.errorText}>No product details available.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product Details</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartPage')}
          >
            <Ionicons name="cart" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: `http://192.168.1.8/dbapp/${selectedVariant ? selectedVariant.image_url : product.image_url}` }}
          style={styles.productImage}
        />

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.basePrice}>Base Price: ${product.base_price.toFixed(2)}</Text>

        <Text style={styles.variantHeader}>Select a Variant:</Text>
        <View style={styles.variantContainer}>
          {product.variants.map((variant) => (
            <TouchableOpacity
              key={variant.variant_id}
              style={[
                styles.variantButton,
                selectedVariant?.variant_id === variant.variant_id && styles.selectedVariant,
              ]}
              onPress={() => handleVariantSelect(variant)}
            >
              <Text style={styles.variantText}>{variant.variant_name}</Text>
              <Text style={styles.stockText}>Stock: {variant.stock_quantity}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Quantity:</Text>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice().toFixed(2)}</Text>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  cartButton: { position: 'absolute', right: 16 },
  scrollContent: { padding: 16, backgroundColor: '#fff' },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginVertical: 8 },
  description: { fontSize: 16, color: '#000', marginBottom: 8 },
  basePrice: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  variantHeader: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  variantContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  variantButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedVariant: { backgroundColor: '#ddd' },
  variantText: { color: '#000' },
  stockText: { color: '#000', marginTop: 4 },
  bottomContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#000', marginVertical: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  quantityText: { fontSize: 18, fontWeight: 'bold', color: '#000', marginHorizontal: 10 },
  quantityButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
  addToCartButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  addToCartButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
  },
  orderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  errorText: { textAlign: 'center', fontSize: 18, color: 'red', marginTop: 16 },
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' },
});

export default ProductDetailsPage;
