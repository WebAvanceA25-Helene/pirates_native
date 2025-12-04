import { View, Text, StyleSheet } from "react-native";
import CheckBox from "expo-checkbox";
import { useState } from "react";
import { Boat } from "../types/boatType";

//Aidé par AI
type Props = {
  boat: Boat
};

const BoatCard = ({ boat }: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxCheck = () => {
    setIsChecked(!isChecked);
  }

  return (
    <View
      style={isChecked ? styles.checked : styles.unchecked}
    >
      {/* Title */}
      <CheckBox
        onValueChange={handleCheckBoxCheck}
        value={isChecked}
        color={isChecked ? "#00f" : "#000"} //AI
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
        {boat.name}
      </Text>

      {/* Main details */}
      <View style={{ gap: 4 }}>
        <Text>Captain: {boat.captain}</Text>
        <Text>Gold cargo: {boat.goldCargo}</Text>
        <Text>Crew size: {boat.crewSize}</Text>
        <Text>Status: {boat.status}</Text>
        <Text>Created by: {boat.createdBy}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  unchecked: {
    backgroundColor: 'white',
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
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderBlockColor: '#00f',
    shadowColor: '#005',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  }

})

export default BoatCard