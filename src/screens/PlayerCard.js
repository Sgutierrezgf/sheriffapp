import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PlayerCard({ route }) {
  const [goldAmount, setGoldAmount] = useState("");
  const [productQuantities, setProductQuantities] = useState(
    Array(products.length).fill(0)
  );
  const navigation = useNavigation(); // Obtenemos el objeto de navegación

  const { player, sendDataToPlayerList } = route.params;

  const increaseQuantity = (index) => {
    const newQuantities = [...productQuantities];
    newQuantities[index] += 1;
    setProductQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...productQuantities];
    if (newQuantities[index] > 0) {
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

    // Una vez enviados los datos, regresamos al componente PlayerList
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.productContainer}>
      <Image style={styles.productImage} source={{ uri: item.avatar }} />
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
    <View style={styles.container}>
      <Text style={styles.playerName}>Nombre: {player.name}</Text>
      <View style={styles.goldInputContainer}>
        <Text style={styles.label}>Cantidad de Oro:</Text>
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
        numColumns={3}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSendData}>
        <Text style={styles.submitButtonText}>Enviar Datos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111", // Negro
  },
  playerName: {
    color: "#fff", // Blanco
    fontSize: 18,
    marginBottom: 10,
  },
  productContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#555", // Gris oscuro
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B0082", // Violeta
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 20,
    marginHorizontal: 5,
    backgroundColor: "#FFD700", // Amarillo
    color: "#111", // Negro
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    color: "#fff", // Blanco
  },
  goldInputContainer: {
    marginTop: 20,
  },
  label: {
    color: "#FF4500", // Rojo oscuro
    fontSize: 16,
  },
  goldInput: {
    borderWidth: 1,
    borderColor: "#555", // Gris oscuro
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    color: "#fff", // Blanco
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#008000", // Verde
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff", // Blanco
    fontSize: 16,
  },
});
const products = [
  {
    name: "Manzanas",
    price: 2,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/apple.png?raw=true",
  },
  {
    name: "Queso",
    price: 5,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/cheese.png?raw=true",
  },
  {
    name: "Pan",
    price: 1,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/white-bread.png?raw=true",
  },
  {
    name: "Pollos",
    price: 7,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/hen.png?raw=true",
  },
  {
    name: "Pimienta",
    price: 3,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/black-pepper.png?raw=true",
  },
  {
    name: "Aguamiel",
    price: 4,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/mead.png?raw=true",
  },
  {
    name: "Seda",
    price: 10,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/silk.png?raw=true",
  },
  {
    name: "Ballesta",
    price: 15,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/crossbow.png?raw=true",
  },
  {
    name: "Manzanas verdes",
    price: 2,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/green-apple.png?raw=true",
  },
  {
    name: "Manzanas doradas",
    price: 3,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/golden-apple.png?raw=true",
  },
  {
    name: "Queso Gouda",
    price: 8,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/gouda-cheese.png?raw=true",
  },
  {
    name: "Queso azul",
    price: 6,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/blue-cheese.png?raw=true",
  },
  {
    name: "Pan de centeno",
    price: 2,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/rye-bread.png?raw=true",
  },
  {
    name: "Pan integral",
    price: 2,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/bread.png?raw=true",
  },
  {
    name: "Gallo Real",
    price: 25,
    avatar:
      "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/rooster.png?raw=true",
  },
];
