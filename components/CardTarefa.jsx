import { useState } from "react";
import { Button, StyleSheet, Switch, Text, View } from "react-native";

export function CardTarefa({ tarefa, onToggle, onDelete, onEdit }) {
  const [disabled, setDisabled] = useState(false);
  const handleDelete = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 5000);
    onDelete(tarefa);
  };
  return (
    <View style={styles.card}>
      <View style={styles.descricaoContainer}>
        <Text style={{ flex: 1 }}>{tarefa.descricao}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={tarefa.concluida ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          value={tarefa.concluida}
          onValueChange={() => onToggle(tarefa)}
        />
      </View>
      <View style={styles.botoesContainer}>
        <Button
          disabled={disabled}
          color="blue"
          onPress={() => onEdit(tarefa)}
          title="Editar"
        />
        <Button
          disabled={disabled}
          color="indianred"
          onPress={handleDelete}
          title="Excluir"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
    padding: 5,
    margin: 5,
  },
  descricaoContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
});
