import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"

const RootStack = createStackNavigator();

const RootNavigator = ({ userUid }) => (
  <RootStack.Navigator screenOptions={{headerShown: false}}>
    {userUid ? (
      <RootStack.Screen name="Main" component={MainNavigator} />
    ) : (
      <RootStack.Screen name="Auth" component={AuthNavigator} />
    )}
  </RootStack.Navigator>
);

export default RootNavigator
