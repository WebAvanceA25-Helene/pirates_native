/*
import React, { useState } from "react";
import CheckBox from '@react-native-community/checkbox';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [boats, setBoats] = useState<any>([]);
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
        console.log(jsonRes);
        await SecureStore.setItemAsync('token', jsonRes.token); //AI
        console.log(await SecureStore.getItemAsync('token'));//AI
        setLogged(await SecureStore.getItemAsync('token') !== null);
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
    setErrorMessage("Logout successful!");
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setLogged(false);
    setUsername("");
    setErrorMessage("Logout successful!");
  };

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
        console.log(jsonRes);
        setBoats(jsonRes); //Clairement ça marchera pas juste comme ça
      } else {
        setErrorMessage("Invalid username or password");
      }

    } catch (res) {
      setErrorMessage("Failed to login\t" + res);
    }
  }

  const handleCheckBoxCheck = () => {

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
          <Button
            title="Se connecter"
            accessibilityLabel="submitButton" // 👈 Maestro s'en sert
            onPress={handleLogin}
          />
        </>
      ) : (
        <Text accessibilityLabel="welcomeText">
          Bienvenue {email}
        </Text>
      )}
    </View>
  );
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
});
*/
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = () => {
    setSubmitted(true);
  };

  const handleLogout = () => {
    setSubmitted(false);
    setEmail(""); // Optionnel : réinitialiser l'email
  };

  return (
    <View style={styles.container}>
      {!submitted ? (
        <>
          <Text style={styles.title}>Login</Text>
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
      ) : (
        <>
          <Text accessibilityLabel="welcomeText">
            Welcome {username}, you are logged in
          </Text>
          <FlatList
            data={boats}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.listItem}>
                <Text>Selected</Text>
                <Text>Boat name</Text>
                <Text>Captain</Text>
                <Text>Status</Text>
                <Text>Gold cargo</Text>
                <Text>Crew size</Text>
                <Text>Creator</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <CheckBox
                  onValueChange={handleCheckBoxCheck}
                />
                <Text>{item.name}</Text>
                <Text>{item.captain}</Text>
                <Text>{item.status}</Text>
                <Text>{item.goldCargo}</Text>
                <Text>{item.crewSize}</Text>
                <Text>{item.createdBy}</Text>
              </View>
            )}
          />
          <Button
            title="Log out"
            accessibilityLabel="logoutButton"
            onPress={handleLogout}
          />
        </>
      )}
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
});

