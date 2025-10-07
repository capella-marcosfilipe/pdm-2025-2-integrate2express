import {
  addTarefa,
  deleteTarefa,
  getTarefas,
  updateTarefa,
} from "@/services/tarefaService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CardTarefa } from "../components/CardTarefa";

export default function TelaTarefas() {
  const [descricao, setDescricao] = useState("");
  const [editando, setEditando] = useState(null);
  const [novaDescricao, setNovaDescricao] = useState("");
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const updateMutation = useMutation({
    mutationFn: updateTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: addTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      setDescricao("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const handleAdd = () => {
    if (!descricao.trim()) {
      Alert.alert("Atenção", "A descrição não pode estar vazia");
      return;
    }
    addMutation.mutate({ descricao });
  };

  function handleToggle(tarefa) {
    console.log("toggle executado", tarefa);
    updateMutation.mutate({
      ...tarefa,
      concluida: !tarefa.concluida,
    });
  }

  function handleDelete(tarefa) {
    deleteMutation.mutate(tarefa);
  }
 
   function handleEdit(tarefa) {
     setEditando(tarefa);
     setNovaDescricao(tarefa.descricao);
   }
 
   function handleUpdate() {
     if (!novaDescricao.trim()) {
       Alert.alert("Atenção", "A descrição não pode estar vazia");
       return;
     }
     updateMutation.mutate({
       ...editando,
       descricao: novaDescricao,
     });
     setEditando(null);
     setNovaDescricao("");
   }

   return (
     <View style={styles.container}>
       <View style={styles.inputView}>
        <TextInput
          style={styles}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <Button title="ADD" onPress={handleAdd} />
      </View>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardTarefa
            tarefa={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      />
      {(isPending || error || isFetching) && (
        <View style={styles.statusbar}>
          {isPending && <Text>Carregando...</Text>}
          {error && <Text>Erro: {error.message}</Text>}
          {isFetching && <Text>Atualizando...</Text>}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={editando !== null}
        onRequestClose={() => setEditando(null)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Editar Tarefa</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNovaDescricao}
            value={novaDescricao}
          />
          <View style={styles.modalButtons}>
            <Button title="Salvar" onPress={handleUpdate} />
            <Button title="Cancelar" onPress={() => setEditando(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  statusbar: {
    backgroundColor: "yellow",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 5,
  },
  inputView: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});
