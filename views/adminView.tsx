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

const AdminView = ({mainBoats, mainBrokerUsers}: Props) => {

    const [errorMessage, setErrorMessage] = useState("");

    const [boats, setBoats] = useState<Boat[]>(mainBoats);
    const [selectedBoatName, setSelectedBoatName] = useState("");
    const [selectedBrokerUser, setSelectedBrokerUser] = useState("");

    const [createBoatName, setCreateBoatName] = useState("");
    const [createBoatGold, setCreateBoatGold] = useState(0);
    const [createBoatCaptain, setCreateBoatCaptain] = useState("");
    const [createBoatCrew, setCreateBoatCrew] = useState(0);


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
    <View>
        <View style={{height:25}}/>
        <FlatList
        data={boats}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <BoatCard boat={item} setErrorMessage={setErrorMessage} getBoats={handleGetBoats} />} //AI
        />

        <View style={ styles.line }/>
        <Text>
        Add a ship to this port:
        </Text>
        <View style={styles.inputLine}>
            <Text>Boat name</Text>
            <TextInput
            placeholder="Boat name"
            value={createBoatName}
            onChangeText={setCreateBoatName}
            accessibilityLabel="createBoatNameInput"
            style={styles.input}
            />
        </View>
        <View style={styles.inputLine}>
            <Text>Gold cargo</Text>
            <TextInput 
            placeholder="Gold cargo"
            keyboardType="numeric" 
            onChangeText={(number) => setCreateBoatGold(Number(number))} 
            value={String(createBoatGold)} 
            style={styles.input}
            />
        </View>
        <View style={styles.inputLine}>
            <Text>Captain</Text>
            <TextInput
            placeholder="Boat captain"
            value={createBoatCaptain}
            onChangeText={setCreateBoatCaptain}
            accessibilityLabel="createBoatCaptainInput"
            style={styles.input}
            />
        </View>
        <View style={styles.inputLine}>
            <Text>Crew size</Text>
            <TextInput 
            placeholder="Crew size"
            keyboardType="numeric" 
            onChangeText={(number) => setCreateBoatCrew(Number(number))} 
            value={String(createBoatCrew)} 
            style={styles.input}
            />
        </View>
        <Button
        title="Add this ship to the port"
        onPress={handleAddShip}
        />


        <View style={styles.line}
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
  },
  inputLine: {
    flexDirection: 'row'
  }
});

export default AdminView