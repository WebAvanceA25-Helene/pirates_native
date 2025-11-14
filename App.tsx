import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import * as Keychain from 'react-native-keychain';

export default function App() {
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (string user, string pass) => {
    try {
        const res = await fetch('', {body: username: user, password: pass}); //Helped by AI
        if(res.ok) {
            await Keychain.setGenericPassword("token", res.token); //AI
            setLogged(await keychain.getGenericPassword());
        } else {
            setErrorMessage("Invalid username or password");
        }

    } catch (e) {
        setErrorMessage(e.Message);
    }
  };

  const handleLogout = () => {
    setLogged(false);
    setUsername("");
  };

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
          <Text accessibilityLabel="ErrorMessageLabel" value={errorMessage}></Text>
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
          <Button
            title="Log out"
            accessibilityLabel="logoutButton" // 👈 utile pour Maestro
            onPress={handleLogout}
          />
        </>
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

