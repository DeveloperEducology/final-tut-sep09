import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const RequestDemoComponent = ({name,title, onDemoPress}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dear {name}</Text>
      <Text style={styles.subtitle}>You Have Not Requested Any Tutor</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('Request a free demo class!')}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
      <Text style={styles.question}>
        Have Some Questions?{' '}
        <Text style={styles.contactUs} onPress={() => Linking.openURL('mailto:contact@tutor.com')}>
          Contact Us
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#B500FF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8B0000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  question: {
    fontSize: 16,
    color: '#000',
  },
  contactUs: {
    color: '#B22222',
    fontWeight: 'bold',
  },
});

export default RequestDemoComponent;
