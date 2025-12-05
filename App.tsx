import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import * as SecureStore from 'expo-secure-store';
import BoatCard from "./views/boatCard"
import { Boat } from "./types/boatType";

export default function App() {
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatName, setSelectedBoatName] = useState("");
  const [brokerUsers, setBrokerUsers] = useState<string[]>([]);
  const [selectedBrokerUser, setSelectedBrokerUser] = useState(brokerUsers[0]);

  const [createBoatName, setCreateBoatName] = useState("");
  const [createBoatGold, setCreateBoatGold] = useState(0);
  const [createBoatCaptain, setCreateBoatCaptain] = useState("");
  const [createBoatCrew, setCreateBoatCrew] = useState(0);

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
        setLogged(await SecureStore.getItemAsync('token') !== null); //AI
        setErrorMessage("Login successful!");
        handleGetBoats();
        handleGetBrokerUsers();
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

  const handleSailShip = async () => {
    try {
      const writtenBoat = boats.find(boat => boat.name === selectedBoatName);
      const writtenBrokerUser = brokerUsers.find(user => user === selectedBrokerUser);
      const token = await SecureStore.getItemAsync('token');
      if(writtenBoat && writtenBrokerUser){
        const res = await fetch(base_url + '/ships/send/'+writtenBrokerUser, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            id: writtenBoat.id
          })
        }); //Helped by AI (existence du fetch et ajout des headers et du stringify)
  
        if(res.ok) {
          handleGetBoats();
          setErrorMessage("Sailling successful");
        } else {
          setErrorMessage("Sailling unsuccessful");
        }
      }
      else {
        setErrorMessage("Invalid boat name or destination port");
      }

    } catch (res) {
      setErrorMessage("Failed to sail this boat\t" + res);
    }
  }

  const handleAddShip = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch(base_url + '/ships/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: createBoatName,
          goldCargo: createBoatGold,
          captain: createBoatCaptain,
          crewSize: createBoatCrew,
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        handleGetBoats();
        setErrorMessage("Boat creation successful");
      } else {
        setErrorMessage("Boat creation unsuccessful");
      }

    } catch (res) {
      setErrorMessage("Failed to create this boat\t" + res);
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
      ) : (
        <>
          <Text accessibilityLabel="welcomeText">
            Welcome {username}, you are logged in
          </Text>
          <FlatList
            data={boats}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <BoatCard boat={item} setErrorMessage={setErrorMessage} getBoats={handleGetBoats} />} //AI
          />

          <View style={{
              height: 1,            
              backgroundColor: "#eee",
              width: "100%",
              marginVertical: 8,
            }}
          />
          <Text>
            Add a ship to this port:
          </Text>
          <Text>Boat name</Text>
          <TextInput
            placeholder="Boat name"
            value={createBoatName}
            onChangeText={setCreateBoatName}
            accessibilityLabel="createBoatNameInput"
            style={styles.input}
          />
          <Text>Gold cargo</Text>
          <TextInput 
            placeholder="Gold cargo"
            keyboardType="numeric" 
            onChangeText={(number) => setCreateBoatGold(Number(number))} 
            value={String(createBoatGold)} 
            style={styles.input}
          />
          <Text>Captain</Text>
          <TextInput
            placeholder="Boat captain"
            value={createBoatCaptain}
            onChangeText={setCreateBoatCaptain}
            accessibilityLabel="createBoatCaptainInput"
            style={styles.input}
          />
          <Text>Crew size</Text>
          <TextInput 
            placeholder="Crew size"
            keyboardType="numeric" 
            onChangeText={(number) => setCreateBoatCrew(Number(number))} 
            value={String(createBoatCrew)} 
            style={styles.input}
          />
          <Button
            title="Add this ship to the port"
            onPress={handleAddShip}
          />


          <View style={{
              height: 1,            
              backgroundColor: "#eee",
              width: "100%",
              marginVertical: 8,
            }}
          />
          <Text>
            Sail a ship to another port:
          </Text>
          <TextInput
            placeholder="Boat name"
            value={selectedBoatName}
            onChangeText={setSelectedBoatName}
            accessibilityLabel="sailBoatNameInput"
            style={styles.input}
          />
          <TextInput
            placeholder="Destination port"
            value={selectedBrokerUser}
            onChangeText={setSelectedBrokerUser}
            accessibilityLabel="sailDestinationInput"
            style={styles.input}
          />
          <Button
            title="Send this boat to this port"
            onPress={handleSailShip}
          />

          <Text accessibilityLabel="ErrorMessageLabel">
            {errorMessage}
          </Text>
          <Button
            title="Log out"
            accessibilityLabel="logoutButton"
            onPress={handleLogout}
          />
        </>
      )}
    </View>
  );//Aide de chatGPT pour le flatlist et le picker
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

