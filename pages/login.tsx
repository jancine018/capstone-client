import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Use the hook here

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigation = useNavigation(); // Access navigation here

  // Handle form submission
  // Handle form submission
const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }
  
    setLoading(true);
    
    try {
      const response = await axios.post('http://192.168.1.8/dbapp/login.php', {
        email,
        password,
      });
  
      if (response.data.success && response.data.user.role === 'Customer') {
        Alert.alert('Login Success', 'Welcome back, Customer!');
        navigation.navigate('Dashboard');
      } else if (response.data.success && response.data.user.role !== 'Customer') {
        Alert.alert('Login Failed', 'You are not authorized to login as a customer.');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        Alert.alert('Login Failed', error.response ? error.response.data.error : 'An error occurred. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <Text style={styles.header}>Customer Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the login form
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: 'black',
    marginVertical: 10,
    borderRadius: 5,
  },
  registerLink: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Login;
