import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import CheckBox from "expo-checkbox";
import { useState } from "react";
import { Boat } from "../types/boatType";
import * as SecureStore from 'expo-secure-store';


//Aidé par AI
type Props = {
  boat: Boat,
  setErrorMessage: (message: string) => void,
  getBoats: () => void
};

const base_url = "https://edwrdlhelene.me:2222/api"

const BoatCard = ({ boat, setErrorMessage, getBoats }: Props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [goldQty, setGoldQty] = useState(0);

  const handleCheckBoxCheck = () => {
    setIsChecked(!isChecked);
  }

  const handleIncrementCrewSize = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const res = await fetch(base_url + '/ships/hire/'+boat.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          oldCrewSize: boat.crewSize
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        getBoats();
        setErrorMessage("Crew member hiring successful");
      } else {
        setErrorMessage("Crew member hiring unsuccessful" +res.status+ res.statusText);
      }
      
    } catch (res) {
      setErrorMessage("Failed to hire a crew member on this boat\t" + res);
    }
  }

  const handleDecrementCrewSize = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const res = await fetch(base_url + '/ships/fire/'+boat.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          oldCrewSize: boat.crewSize
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        getBoats();
        setErrorMessage("Crew member firing successful");
      } else {
        setErrorMessage("Crew member firing unsuccessful"+res.statusText);
      }
      
    } catch (res) {
      setErrorMessage("Failed to fire crew member from this boat\t" + res);
    }
  }

  const handleAddGold = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const res = await fetch(base_url + '/ships/addGold/'+boat.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          oldGoldQty: boat.goldCargo,
          goldQty: goldQty
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        getBoats();
        setErrorMessage("Gold adding successful");
      } else {
        setErrorMessage("Gold adding unsuccessful" + res.statusText);
      }
      
    } catch (res) {
      setErrorMessage("Failed to add gold on this boat\t" + res);
    }
  }

  const handleTakeOutGold = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const res = await fetch(base_url + '/ships/takeOutGold/'+boat.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          oldGoldQty: boat.goldCargo,
          goldQty: goldQty
        })
      }); //Helped by AI (existence du fetch et ajout des headers et du stringify)

      if(res.ok) {
        getBoats();
        setErrorMessage("Gold taking out successful");
      } else {
        setErrorMessage("Gold taking out unsuccessful" + res.statusText);
      }
      
    } catch (res) {
      setErrorMessage("Failed to take gold from this boat\t" + res);
    }
  }

  return (
    <View
      style={isChecked ? styles.checked : styles.unchecked}
    >
      <CheckBox
        onValueChange={handleCheckBoxCheck}
        value={isChecked}
        color={isChecked ? "#00f" : "#000"} //AI
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
        {boat.name}
      </Text>

      <View style={{ gap: 4 }}>
        <Text>Captain: {boat.captain}</Text>
        <Text>Gold cargo: {boat.goldCargo}
          <Button title="-" onPress={handleTakeOutGold}/>
          <TextInput keyboardType="numeric" onChangeText={(number) => setGoldQty(Number(number))} value={String(goldQty)} style={styles.input}/>
          <Button title="+" onPress={handleAddGold}/>
        </Text>
        <Text>Crew size: {boat.crewSize} <Button title="-" onPress={handleDecrementCrewSize}/><Button title="+" onPress={handleIncrementCrewSize}/></Text>
        <Text>Status: {boat.status}</Text>
        <Text>Created by: {boat.createdBy}</Text>
      </View>
    </View>
  );
};//Transtypage vient de l'AI

const styles = StyleSheet.create({

  unchecked: {
    backgroundColor: 'white',
    width: 250,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  checked: {
    backgroundColor: '#ADD8E6',
    width: 250,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderBlockColor: '#00f',
    shadowColor: '#005',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  }
})

export default BoatCard