import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [startgame, setStartgame] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [kingAndQueenBonuses, setKingAndQueenBonuses] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const addPlayers = () => {
    if (players.length < 6 && !startgame) {
      // Verifica si el nombre del jugador anterior está vacío
      const lastPlayer = players[players.length - 1];
      if (lastPlayer && lastPlayer.name.trim() === "") {
        // No se permite agregar otro jugador si el nombre está vacío
        return;
      }
      setPlayers([...players, { name: "" }]);
    }
  };

  const updateName = (index, name) => {
    if (!startgame) {
      const newPlayers = [...players];
      newPlayers[index].name = name;
      setPlayers(newPlayers);
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      setStartgame(true);
    }
  };

  const calculateWinner = () => {
    if (players.length < 2) {
      // Mostrar mensaje de que se necesitan al menos dos jugadores
      alert("Deben haber al menos dos jugadores para calcular al ganador.");
      return;
    }

    const missingDetails = players.some((player, index) => !playerData[index]);

    if (missingDetails) {
      // Muestra el modal en lugar de la alerta
      showMissingDetailsModal();
      return;
    }
    const bonuses = {
      Apples: { King: 20, Queen: 10 },
      Cheese: { King: 15, Queen: 10 },
      Bread: { King: 15, Queen: 10 },
      Chickens: { King: 10, Queen: 5 },
    };

    const kingAndQueenResults = {};

    Object.keys(bonuses).forEach((productType) => {
      const playersByProduct = players
        .map((player, index) => ({
          index,
          quantity: playerData[index]
            ? playerData[index].selectedProducts.reduce(
                (acc, product) =>
                  product.name === productType ? acc + product.quantity : acc,
                0
              )
            : 0,
        }))
        .sort((a, b) => b.quantity - a.quantity);

      const kingIndex = playersByProduct[0].index;
      const queenIndex =
        playersByProduct.length > 1 ? playersByProduct[1].index : null;

      kingAndQueenResults[productType] = {
        King: kingIndex,
        Queen: queenIndex,
      };

      setPlayerData((prevData) => ({
        ...prevData,
        [kingIndex]: {
          ...prevData[kingIndex],
          totalPoints:
            (prevData[kingIndex]?.totalPoints || 0) + bonuses[productType].King,
        },
        [queenIndex]:
          queenIndex !== null
            ? {
                ...prevData[queenIndex],
                totalPoints:
                  (prevData[queenIndex]?.totalPoints || 0) +
                  bonuses[productType].Queen,
              }
            : prevData[queenIndex],
      }));
    });

    setKingAndQueenBonuses(kingAndQueenResults);
  };
  const showMissingDetailsModal = () => {
    setModalVisible(true);
  };

  const goToPlayerDetails = (index) => {
    navigation.navigate("PlayerCard", {
      player: players[index],
      sendDataToPlayerList: (data) =>
        handleReceiveDataFromPlayerCard(data, index),
    });
  };

  const handleReceiveDataFromPlayerCard = (data, playerIndex) => {
    console.log(
      `Datos recibidos en PlayerList para el Jugador ${playerIndex + 1}:`,
      data
    );

    const totalPoints =
      data.goldAmount +
      data.selectedProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

    setPlayerData((prevData) => ({
      ...prevData,
      [playerIndex]: {
        ...data,
        totalPoints: totalPoints,
      },
    }));
  };

  const getWinnerIndex = () => {
    const totalPointsArray = Object.values(playerData).map(
      (player) => player.totalPoints
    );
    return totalPointsArray.indexOf(Math.max(...totalPointsArray));
  };

  const getWinnerTotalPoints = () => {
    return playerData[getWinnerIndex()]?.totalPoints || 0;
  };

  const restartGame = () => {
    setPlayers([]);
    setStartgame(false);
    setPlayerData({});
    setKingAndQueenBonuses({});
  };

  const removePlayer = (index) => {
    if (startgame) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Jugadores:</Text>
      {players.map((player, index) => (
        <View key={index} style={styles.playerContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Nombre del Jugador ${index + 1}`}
            value={player.name}
            onChangeText={(name) => updateName(index, name)}
            editable={!startgame}
          />
          {startgame && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => goToPlayerDetails(index)}
              >
                <Image
                  source={{
                    uri: "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/money.png?raw=true",
                  }}
                  style={styles.detailImage}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removePlayerButton}
                onPress={() => removePlayer(index)}
              >
                <Image
                  source={{
                    uri: "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/cancel.png?raw=true",
                  }}
                  style={styles.removePlayerImage}
                />
              </TouchableOpacity>
            </View>
          )}
          {playerData[index] && (
            <View style={styles.playerInfoContainer}>
              <Text style={styles.playerInfoHeader}>
                Información del Jugador {index + 1}:
              </Text>
              <Text style={styles.playerInfoText}>
                Total de Puntos:{" "}
                {isNaN(playerData[index].totalPoints)
                  ? 0
                  : playerData[index].totalPoints}
              </Text>
              <Text style={styles.playerInfoText}>
                Cantidad de Oro:{" "}
                {isNaN(playerData[index].goldAmount)
                  ? 0
                  : playerData[index].goldAmount}
              </Text>

              <Text style={styles.playerInfoHeader}>
                Productos seleccionados:
              </Text>
              {playerData[index].selectedProducts.map(
                (product, productIndex) => (
                  <Text key={productIndex} style={styles.playerInfoText}>
                    {product.name}: {product.quantity} unidades
                  </Text>
                )
              )}
            </View>
          )}
        </View>
      ))}

      {!startgame && (
        <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayers}>
          <Image
            source={{
              uri: "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/plus.png?raw=true",
            }}
            style={styles.addPlayerImage}
          />
        </TouchableOpacity>
      )}
      {!startgame && players.length >= 2 && (
        <Button title="Iniciar Juego" onPress={startGame} color="#008000" />
      )}
      {startgame && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.calculateWinnerButton}
            onPress={calculateWinner}
          >
            <Image
              source={{
                uri: "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/winner.png?raw=true",
              }}
              style={styles.calculateWinnerImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restartGameButton}
            onPress={restartGame}
          >
            <Image
              source={{
                uri: "https://github.com/Sgutierrezgf/imagenes/blob/main/Sherriff/refresh.png?raw=true",
              }}
              style={styles.restartGameImage}
            />
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.winnerText}>
        Ganador: Jugador {getWinnerIndex() + 1} (Total de puntos:{" "}
        {getWinnerTotalPoints()})
      </Text>
      <Text style={styles.bonusText}>
        Bonificaciones del Rey y la Reina:
        {Object.keys(kingAndQueenBonuses).map((productType, index) => (
          <Text key={index} style={styles.bonusDetails}>
            {productType}: Rey (Jugador{" "}
            {kingAndQueenBonuses[productType].King + 1}), Reina (Jugador{" "}
            {kingAndQueenBonuses[productType].Queen + 1}){" "}
          </Text>
        ))}
      </Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Ingresa detalles para todos los jugadores antes de calcular al
              ganador.
            </Text>
            <Button
              style={styles.ok}
              title="OK"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111",
  },
  addPlayerButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addPlayerImage: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  calculateWinnerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4500", // Puedes cambiar el color según tus preferencias
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10, // Espacio entre los botones
  },
  calculateWinnerImage: {
    width: 30,
    height: 30,
  },
  restartGameButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4500", // Puedes cambiar el color según tus preferencias
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  restartGameImage: {
    width: 30,
    height: 30,
  },
  removePlayerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4500", // Puedes cambiar el color según tus preferencias
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD700", // Puedes cambiar el color según tus preferencias
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  detailImage: {
    width: 30,
    height: 30,
  },
  removePlayerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD700", // Puedes cambiar el color según tus preferencias
    padding: 10,
    borderRadius: 5,
  },
  removePlayerImage: {
    width: 30,
    height: 30,
  },
  playerInfoHeader: {
    color: "#FFD700",
    fontSize: 18,
    marginBottom: 10,
  },
  playerInfoText: {
    color: "#fff",
    marginBottom: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  playerContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    padding: 8,
    color: "#fff",
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#111",
    fontSize: 16,
  },
  playerDetailsText: {
    color: "#fff",
  },
  winnerText: {
    color: "#fff",
  },
  bonusText: {
    color: "#fff",
  },
  bonusDetails: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#111", // Puedes cambiar esto según tus preferencias
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#fff", // Puedes ajustar el color del texto según tus preferencias
    marginBottom: 20,
  },
});
