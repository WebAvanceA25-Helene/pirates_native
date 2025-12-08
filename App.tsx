import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import * as SecureStore from 'expo-secure-store';
import BoatCard from "./views/boatCard"
import { Boat } from "./types/boatType";
import AdminView from "./views/adminView";
import UserView from "./views/userView";

export default function App() {
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [boats, setBoats] = useState<Boat[]>([]);
  const [brokerUsers, setBrokerUsers] = useState<string[]>([]);

  const base_url = "https://edwrdlhelene.me:2222/api"

  const handleLogin = async () => {
    try {
      const res = await fetch(base_url + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        const jsonRes = await res.json();
        await SecureStore.setItemAsync('token', jsonRes.token); //AI
        handleGetBoats();
        handleGetBrokerUsers();
        handleIsAdmin();
        setLogged(await SecureStore.getItemAsync('token') !== null); //AI
        setErrorMessage("Login successful!");
      } else {
        setErrorMessage("Invalid username or password");
      }

    } catch (res) {
      setErrorMessage("Failed to login\t" + res);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setLogged(false);
    setUsername("");
    setPassword("");
    setErrorMessage("Logout successful!");
  };

  const handleIsAdmin = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch( base_url + '/auth/me', {
        method: 'Get',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      }); //Helped by AI (nom du token dans les headers)

      if(res.ok) {
        const jsonRes = await res.json();
        setIsAdmin(jsonRes.user.isAdmin);
      } else {
        setErrorMessage("Couldn't get me");
      }

    } catch (res) {
      setErrorMessage("Failed to get me\t" + res);
    }
  }

  const handleGetBoats = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch( base_url + '/ships', {
        method: 'Get',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      }); //Helped by AI (nom du token dans les headers)

      if(res.ok) {
        const jsonRes = await res.json();
        setBoats(jsonRes);
      } else {
        setErrorMessage("Couldn't get boats");
      }

    } catch (res) {
      setErrorMessage("Failed to get boat list\t" + res);
    }
  }

  const handleGetBrokerUsers = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch( base_url + '/ships/send/userlist', {
        method: 'Get',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      }); //Helped by AI (nom du token dans les headers)

      if(res.ok) {
        const jsonRes = await res.json();
        setBrokerUsers(jsonRes);
      } else {
        setErrorMessage("Couldn't get broker user list");
      }

    } catch (res) {
      setErrorMessage("Failed to broker user list\t" + res);
    }
  }

  return (
    <View style={styles.container}>
      {!logged ? (
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            accessibilityLabel="usernameInput"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} //AI
            accessibilityLabel="passwordInput"
            style={styles.input}
          />
          <Text accessibilityLabel="ErrorMessageLabel">
            {errorMessage}
          </Text>
          <Button
            title="Log in"
            accessibilityLabel="submitButton"
            onPress={handleLogin}
          />
        </>
      ) : (isAdmin ? (
          <>
          <AdminView mainBoats={boats} mainBrokerUsers={brokerUsers}></AdminView>
          <Button
            title="Log out"
            accessibilityLabel="logoutButton"
            onPress={handleLogout}
          />
          <View style={{height:25}}/>
          </>
        ) : (
          <>
          <UserView mainBoats={boats} mainBrokerUsers={brokerUsers}></UserView>
          <Button
            title="Log out"
            accessibilityLabel="logoutButton"
            onPress={handleLogout}
          />
          <View style={{height:25}}/>
          </>
        ))
    }
    </View>
  );//Aide de chatGPT pour le flatlist
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  listItem: {
     flexDirection: 'row',
     marginBottom: 6
  },
  dropDown: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8 
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#00f"
  }
});

