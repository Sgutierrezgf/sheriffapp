import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [startgame, setStartgame] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [kingAndQueenBonuses, setKingAndQueenBonuses] = useState({});
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

          {playerData[index] && (
            <View>
              <Text>Información del Jugador {index + 1}:</Text>
              <Text>
                Total de Puntos:{" "}
                {isNaN(playerData[index].totalPoints)
                  ? 0
                  : playerData[index].totalPoints}
              </Text>
              <Text>
                Cantidad de Oro:{" "}
                {isNaN(playerData[index].goldAmount)
                  ? 0
                  : playerData[index].goldAmount}
              </Text>

              <Text>
                Rey y Reina de Manzanas:{" "}
                {kingAndQueenBonuses.Apples &&
                  `Jugador ${
                    kingAndQueenBonuses.Apples.King + 1
                  } (Rey) y Jugador ${
                    kingAndQueenBonuses.Apples.Queen + 1
                  } (Reina)`}
              </Text>
              {/* Repite lo anterior para los otros tipos de mercancía */}

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
      <Text>
        Ganador: Jugador {getWinnerIndex() + 1} (Total de puntos:{" "}
        {getWinnerTotalPoints()})
      </Text>
      <Text>
        Bonificaciones del Rey y la Reina:
        {Object.keys(kingAndQueenBonuses).map((productType, index) => (
          <Text key={index}>
            {productType}: Rey (Jugador{" "}
            {kingAndQueenBonuses[productType].King + 1}), Reina (Jugador{" "}
            {kingAndQueenBonuses[productType].Queen + 1}){" "}
          </Text>
        ))}
      </Text>
    </View>
  );
}
