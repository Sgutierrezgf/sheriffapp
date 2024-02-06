import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [startgame, setStartgame] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const navigation = useNavigation();

  const addPlayers = () => {
    if (players.length < 6 && !startgame) {
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
    console.log("Soy un ganador");
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
    setPlayerData((prevData) => ({
      ...prevData,
      [playerIndex]: data,
    }));
  };

  return (
    <View>
      <Text>Players:</Text>
      {players.map((player, index) => (
        <View key={index}>
          <TextInput
            placeholder={`Nombre del Jugador ${index + 1}`}
            value={player.name}
            onChangeText={(name) => updateName(index, name)}
            editable={!startgame}
          />
          {startgame && (
            <TouchableOpacity onPress={() => goToPlayerDetails(index)}>
              <Button
                title="Player Details"
                onPress={() => goToPlayerDetails(index)}
              />
            </TouchableOpacity>
          )}

          {/* Muestra la información del jugador específico */}
          {playerData[index] && (
            <View>
              <Text>Información del Jugador {index + 1}:</Text>
              <Text>
                Cantidad de Oro:{" "}
                {isNaN(playerData[index].goldAmount)
                  ? 0
                  : playerData[index].goldAmount}
              </Text>

              <Text>Productos seleccionados:</Text>
              {playerData[index].selectedProducts.map(
                (product, productIndex) => (
                  <View key={productIndex}>
                    <Text>
                      {product.name}: {product.quantity} unidades
                    </Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>
      ))}

      {!startgame && <Button title="add player" onPress={addPlayers} />}
      {!startgame && players.length >= 2 && (
        <Button title="Start Game" onPress={startGame} />
      )}
      {startgame && (
        <Button title="Calculate Winner" onPress={calculateWinner} />
      )}
    </View>
  );
}
