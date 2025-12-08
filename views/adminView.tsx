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

    const [isBoatListView, setIsBoatListView] = useState(true);

    const [boats, setBoats] = useState<Boat[]>(mainBoats);
    const [selectedBoatName, setSelectedBoatName] = useState("");
    const [selectedBrokerUser, setSelectedBrokerUser] = useState("");

    const [selectedPillagingBoatName, setSelectedPillagingBoatName] = useState("");
    const [selectedPillagedBoatName, setSelectedPillagedBoatName] = useState("");
    const [pillageBoatGold, setPillageBoatGold] = useState(0);

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
          });
    
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
                });
        
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
        });

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

    const handlePillageShip = async () => {
        try {
            const writtenPillagedBoat = boats.find(boat => boat.name === selectedPillagedBoatName);
            const writtenPillagingBoat = boats.find(boat => boat.name === selectedPillagingBoatName);
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(base_url + '/ships/pillage/'+writtenPillagingBoat?.id+'/'+writtenPillagedBoat?.id, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    oldPillagedGoldQty: writtenPillagedBoat?.goldCargo,
                    oldPillagingGoldQty: writtenPillagingBoat?.goldCargo,
                    transferGoldQty: pillageBoatGold,
                    oldTimesPillaged: writtenPillagedBoat?.timesPillaged
                })
            });

            if(res.ok) {
                handleGetBoats();
                setErrorMessage("Boat pillage successful");
            } else {
                console.log(res);
                setErrorMessage("Boat pillage unsuccessful");
            }

        } catch (res) {
        setErrorMessage("Failed to pillage this boat\t" + res);
        }
    }

    return (
    <View style={{width:275}}>
        {isBoatListView ? (
            <>
            <View/>
            <FlatList
            data={boats}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <BoatCard boat={item} setErrorMessage={setErrorMessage} getBoats={handleGetBoats} />} //Le petit bout de fonction avec le item vient de l'AI (note que j'ai utilisé chatGPT partout où c'est écrit AI) ce que ça fait c'est que ça prend l'item (qui est appelé comme ça j'ai pas eu le droit de mettre boat)(et qui est issu de la liste boats parce que data={boats}) et ça appelle mon composant BoatCard, auquel je passe l'item dans les props pour qu'on le gère dans le BoatCard
            style={{maxHeight:700}}
            />
            <Button title="Boat actions" onPress={() => setIsBoatListView(!isBoatListView)}></Button>
            <Text accessibilityLabel="ErrorMessageLabel">
            {errorMessage}
            </Text>
            </>
        ) : (
            <>
            <View style={{height:75}}/>
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
            <View style={styles.inputLine}>
                <Text>Baot to send sailing</Text>
                <TextInput
                placeholder="Boat name"
                value={selectedBoatName}
                onChangeText={setSelectedBoatName}
                accessibilityLabel="sailBoatNameInput"
                style={styles.input}
                />
            </View>
            <View style={styles.inputLine}>
                <Text>Destination port</Text>
                <TextInput
                placeholder="Destination port"
                value={selectedBrokerUser}
                onChangeText={setSelectedBrokerUser}
                accessibilityLabel="sailDestinationInput"
                style={styles.input}
                />
            </View>
            <Button
            title="Send this boat to this port"
            onPress={handleSailShip}
            />

            <View style={styles.line}/>
            <Text>
            Pillage a boat:
            </Text>
            <View style={styles.inputLine}>
                <Text>Boat being stolen from</Text>
                <TextInput
                placeholder="Boat name"
                value={selectedPillagedBoatName}
                onChangeText={setSelectedPillagedBoatName}
                accessibilityLabel="pillagedBoatNameInput"
                style={styles.input}
                />
            </View>
            <View style={styles.inputLine}>
                <Text>Boat stealing from the other</Text>
                <TextInput
                placeholder="Boat name"
                value={selectedPillagingBoatName}
                onChangeText={setSelectedPillagingBoatName}
                accessibilityLabel="pillagingBoatNameInput"
                style={styles.input}
                />
            </View>
            <View style={styles.inputLine}>
                <Text>Quantity of gold stolen</Text>
                <TextInput 
                placeholder="Gold quantity"
                keyboardType="numeric" 
                onChangeText={(number) => setPillageBoatGold(Number(number))} 
                value={String(pillageBoatGold)} 
                style={styles.input}
                />
            </View>
            <Button
            title="Pillage this boat"
            onPress={handlePillageShip}
            />

            <View style={styles.line}/>
            <Button title="Boat list" onPress={() => setIsBoatListView(!isBoatListView)}></Button>
            <Text accessibilityLabel="ErrorMessageLabel">
            {errorMessage}
            </Text>
            </>
        )};
    </View>
    );//Le flatlist en lui même est également le fruit de l'AI
      //Je cherchais un moyen de faire une liste sans que tout soit pris ensemble et en faisant en sorte que tout rentre en largeur
      //c'est là qu'il m'a proposé de faire des petites cartes dans une flatlist (qui en plus permet de scroll dans la liste)
      //J'ai donc accepté cette gentille proposition
      //Le data représente le tableau de données qu'on va chercher à afficher
      //Le renderItem est expliqué plus haut mais c'ets la manière dont on va afficher les items de la liste 
      //Et le keyExtractor lui donne une clé de reconnaissance, ici juste basée sur l'index dans le tableau
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