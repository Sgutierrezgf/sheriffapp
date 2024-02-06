import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayerList from "./src/components/PlayerList";
import PlayerCard from "./src/screens/PlayerCard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlayerList">
        <Stack.Screen name="PlayerList" component={PlayerList} />
        <Stack.Screen name="PlayerCard" component={PlayerCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
