import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import BoatCard from "./boatCard"
import { Boat } from "../types/boatType";
import * as SecureStore from 'expo-secure-store';

type Props = {
    mainBoats: Boat[],
    mainBrokerUsers: string[]
}

const base_url = "https://edwrdlhelene.me:2222/api"

const UserView = ({mainBoats, mainBrokerUsers}: Props) => {

    const [errorMessage, setErrorMessage] = useState("");

    const [boats, setBoats] = useState<Boat[]>(mainBoats);
    const [selectedBoatName, setSelectedBoatName] = useState("");
    const [selectedBrokerUser, setSelectedBrokerUser] = useState("");

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

    const handleSailShip = async () => {
        try {
            const writtenBoat = boats.find(boat => boat.name === selectedBoatName);
            const writtenBrokerUser = mainBrokerUsers.find(user => user === selectedBrokerUser);
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

    return (
    <View>
        <View style={{height:35}}/>
        <FlatList
        data={boats}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <BoatCard boat={item} setErrorMessage={setErrorMessage} getBoats={handleGetBoats} />} //AI
        />

        <View style={styles.line}/>
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
    </View>
    );
};

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
  line: {
    height: 1,            
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 8,
  }
});

export default UserView