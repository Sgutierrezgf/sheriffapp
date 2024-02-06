import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import React, { useState } from "react";

export default function PlayerCard({ route }) {
  const [goldAmount, setGoldAmount] = useState("");
  const [productQuantities, setProductQuantities] = useState(
    Array(products.length).fill(0)
  );

  const { player, sendDataToPlayerList } = route.params;

  const increaseQuantity = (index) => {
    const newQuantities = [...productQuantities];
    newQuantities[index] += 1;
    setProductQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...productQuantities];
    if (newQuantities[index] > 1) {
      newQuantities[index] -= 1;
      setProductQuantities(newQuantities);
    }
  };

  const handleGoldAmountChange = (amount) => {
    setGoldAmount(amount);
  };

  const handleSendData = () => {
    const selectedProducts = products
      .map((product, index) => ({
        ...product,
        quantity: productQuantities[index],
      }))
      .filter((product) => product.quantity > 0);

    const dataToSend = {
      selectedProducts,
      goldAmount: parseInt(goldAmount, 0),
    };

    sendDataToPlayerList(dataToSend);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.productContainer}>
      <Text>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(index)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{productQuantities[index]}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(index)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <Text>Detalles del Jugador:</Text>
      <Text>Nombre: {player.name}</Text>
      <View style={styles.goldInputContainer}>
        <Text>Cantidad de Oro:</Text>
        <TextInput
          style={styles.goldInput}
          keyboardType="numeric"
          value={goldAmount}
          onChangeText={handleGoldAmountChange}
        />
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={5}
      />
      <TouchableOpacity onPress={handleSendData}>
        <Button title="Enviar Datos" onPress={handleSendData} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
  },
  goldInputContainer: {
    marginTop: 20,
  },
  goldInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
});

const products = [
  { name: "Manzanas", price: 2 },
  { name: "Queso", price: 5 },
  { name: "Pan", price: 1 },
  { name: "Pollos", price: 7 },
  { name: "Pimienta", price: 3 },
  { name: "Aguamiel", price: 4 },
  { name: "Seda", price: 10 },
  { name: "Ballesta", price: 15 },
  { name: "Manzanas verdes", price: 2 },
  { name: "Manzanas doradas", price: 3 },
  { name: "Queso Gouda", price: 8 },
  { name: "Queso azul", price: 6 },
  { name: "Pan de centeno", price: 2 },
  { name: "Pan integral", price: 2 },
  { name: "Gallo Real", price: 25 },
];
