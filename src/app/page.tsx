"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, FileText, Home, Utensils, Pill, Trash2, User, Edit2, Activity, Target, Heart, TrendingDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipos
interface FoodEntry {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fiber: number;
  date: string;
}

interface Medication {
  id: string;
  name: string;
  dose: string;
  nextDate: string;
  time: string;
}

interface Symptom {
  id: string;
  description: string;
  date: string;
}

interface UserProfile {
  age: string;
  sex: string;
  weight: string;
  height: string;
  activityLevel: string;
  healthGoal: string;
  dietaryPreferences: string;
  healthConditions: string;
  completedAt: string;
}

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export default function OzemproPlay() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Estados para o quiz inicial
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [quizAge, setQuizAge] = useState("");
  const [quizSex, setQuizSex] = useState("");
  const [quizWeight, setQuizWeight] = useState("");
  const [quizHeight, setQuizHeight] = useState("");
  const [quizActivityLevel, setQuizActivityLevel] = useState("");
  const [quizHealthGoal, setQuizHealthGoal] = useState("");
  const [quizDietaryPreferences, setQuizDietaryPreferences] = useState("");
  const [quizHealthConditions, setQuizHealthConditions] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Estados para alimentos
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [foodName, setFoodName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fiber, setFiber] = useState("");

  // Estados para medicações
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medDate, setMedDate] = useState("");
  const [medTime, setMedTime] = useState("");

  // Estados para sintomas
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomText, setSymptomText] = useState("");

  // Estados para peso
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [editWeightValue, setEditWeightValue] = useState("");

  // Estados para edição de dados
  const [editingFood, setEditingFood] = useState<string | null>(null);
  const [editFoodData, setEditFoodData] = useState<FoodEntry | null>(null);
  const [editingMed, setEditingMed] = useState<string | null>(null);
  const [editMedData, setEditMedData] = useState<Medication | null>(null);

  // Verificar se o quiz já foi completado
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (!savedProfile) {
      setShowQuiz(true);
    } else {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      
      // Adicionar peso inicial se não existir
      const savedWeights = localStorage.getItem("weightEntries");
      if (!savedWeights && profile.weight) {
        const initialWeight: WeightEntry = {
          id: Date.now().toString(),
          weight: parseFloat(profile.weight),
          date: profile.completedAt.split("T")[0],
        };
        setWeightEntries([initialWeight]);
        localStorage.setItem("weightEntries", JSON.stringify([initialWeight]));
      }
    }
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedFoods = localStorage.getItem("foodEntries");
    const savedMeds = localStorage.getItem("medications");
    const savedSymptoms = localStorage.getItem("symptoms");
    const savedWeights = localStorage.getItem("weightEntries");

    if (savedFoods) setFoodEntries(JSON.parse(savedFoods));
    if (savedMeds) setMedications(JSON.parse(savedMeds));
    if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
    if (savedWeights) setWeightEntries(JSON.parse(savedWeights));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("foodEntries", JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem("symptoms", JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));
  }, [weightEntries]);

  // Função para salvar o quiz
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizAge || !quizSex || !quizWeight || !quizHeight || !quizActivityLevel || !quizHealthGoal) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newProfile: UserProfile = {
      age: quizAge,
      sex: quizSex,
      weight: quizWeight,
      height: quizHeight,
      activityLevel: quizActivityLevel,
      healthGoal: quizHealthGoal,
      dietaryPreferences: quizDietaryPreferences,
      healthConditions: quizHealthConditions,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    setUserProfile(newProfile);
    
    // Adicionar peso inicial
    const initialWeight: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(quizWeight),
      date: new Date().toISOString().split("T")[0],
    };
    const newWeights = [...weightEntries, initialWeight];
    setWeightEntries(newWeights);
    localStorage.setItem("weightEntries", JSON.stringify(newWeights));
    
    setShowQuiz(false);
  };

  // Função para editar perfil
  const handleEditProfile = () => {
    if (userProfile) {
      setQuizAge(userProfile.age);
      setQuizSex(userProfile.sex);
      setQuizWeight(userProfile.weight);
      setQuizHeight(userProfile.height);
      setQuizActivityLevel(userProfile.activityLevel);
      setQuizHealthGoal(userProfile.healthGoal);
      setQuizDietaryPreferences(userProfile.dietaryPreferences);
      setQuizHealthConditions(userProfile.healthConditions);
    }
    setShowProfileView(false);
    setShowQuiz(true);
  };

  // Funções para peso
  const addWeight = () => {
    if (!newWeight) return;

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newWeight),
      date: new Date().toISOString().split("T")[0],
    };

    setWeightEntries([...weightEntries, newEntry]);
    setNewWeight("");
  };

  const startEditWeight = (entry: WeightEntry) => {
    setEditingWeight(entry.id);
    setEditWeightValue(entry.weight.toString());
  };

  const saveEditWeight = (id: string) => {
    setWeightEntries(weightEntries.map(entry => 
      entry.id === id ? { ...entry, weight: parseFloat(editWeightValue) } : entry
    ));
    setEditingWeight(null);
    setEditWeightValue("");
  };

  const removeWeight = (id: string) => {
    setWeightEntries(weightEntries.filter(entry => entry.id !== id));
  };

  const getWeightProgress = () => {
    if (weightEntries.length < 2) return null;
    
    const sorted = [...weightEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const initial = sorted[0].weight;
    const current = sorted[sorted.length - 1].weight;
    const diff = current - initial;
    
    return {
      initial,
      current,
      diff,
      percentage: ((diff / initial) * 100).toFixed(1),
    };
  };

  // Funções para alimentos
  const addFood = () => {
    if (!foodName || !protein || !carbs || !fiber) return;

    const newFood: FoodEntry = {
      id: Date.now().toString(),
      name: foodName,
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fiber: parseFloat(fiber),
      date: new Date().toISOString().split("T")[0],
    };

    setFoodEntries([...foodEntries, newFood]);
    setFoodName("");
    setProtein("");
    setCarbs("");
    setFiber("");
  };

  const startEditFood = (food: FoodEntry) => {
    setEditingFood(food.id);
    setEditFoodData(food);
  };

  const saveEditFood = () => {
    if (!editFoodData) return;
    
    setFoodEntries(foodEntries.map(food => 
      food.id === editFoodData.id ? editFoodData : food
    ));
    setEditingFood(null);
    setEditFoodData(null);
  };

  const removeFood = (id: string) => {
    setFoodEntries(foodEntries.filter(food => food.id !== id));
  };

  const getTodayTotals = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayFoods = foodEntries.filter((food) => food.date === today);

    return {
      protein: todayFoods.reduce((sum, food) => sum + food.protein, 0),
      carbs: todayFoods.reduce((sum, food) => sum + food.carbs, 0),
      fiber: todayFoods.reduce((sum, food) => sum + food.fiber, 0),
    };
  };

  // Funções para medicações
  const addMedication = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!medName.trim() || !medDose.trim() || !medDate || !medTime) {
      alert("Por favor, preencha todos os campos da medicação");
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      name: medName.trim(),
      dose: medDose.trim(),
      nextDate: medDate,
      time: medTime,
    };

    setMedications([...medications, newMed]);
    setMedName("");
    setMedDose("");
    setMedDate("");
    setMedTime("");
  };

  const startEditMed = (med: Medication) => {
    setEditingMed(med.id);
    setEditMedData(med);
  };

  const saveEditMed = () => {
    if (!editMedData) return;
    
    setMedications(medications.map(med => 
      med.id === editMedData.id ? editMedData : med
    ));
    setEditingMed(null);
    setEditMedData(null);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const getNextMedication = () => {
    if (medications.length === 0) return null;
    
    const sorted = [...medications].sort((a, b) => 
      new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()
    );
    
    return sorted[0];
  };

  // Funções para sintomas
  const addSymptom = () => {
    if (!symptomText.trim()) return;

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      description: symptomText,
      date: new Date().toISOString().split("T")[0],
    };

    setSymptoms([...symptoms, newSymptom]);
    setSymptomText("");
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(symptom => symptom.id !== id));
  };

  const todayTotals = getTodayTotals();
  const nextMed = getNextMedication();
  const weightProgress = getWeightProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Quiz Inicial */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <User className="w-6 h-6 text-emerald-600" />
              {userProfile ? "Editar Perfil" : "Bem-vindo ao Ozempro Play!"}
            </DialogTitle>
            <DialogDescription>
              {userProfile ? "Atualize suas informações pessoais" : "Para começar, precisamos conhecer você melhor. Preencha suas informações."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuizSubmit} className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Informações Básicas
              </h3>
              
              <div>
                <Label htmlFor="quiz-age">Idade *</Label>
                <Input
                  id="quiz-age"
                  type="number"
                  placeholder="Ex: 35"
                  value={quizAge}
                  onChange={(e) => setQuizAge(e.target.value)}
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <Label htmlFor="quiz-sex">Sexo *</Label>
                <Select value={quizSex} onValueChange={setQuizSex}>
                  <SelectTrigger id="quiz-sex">
                    <SelectValue placeholder="Selecione seu sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quiz-weight">Peso (kg) *</Label>
                <Input
                  id="quiz-weight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={quizWeight}
                  onChange={(e) => setQuizWeight(e.target.value)}
                  min="1"
                  max="500"
                />
              </div>

              <div>
                <Label htmlFor="quiz-height">Altura (cm) *</Label>
                <Input
                  id="quiz-height"
                  type="number"
                  placeholder="Ex: 170"
                  value={quizHeight}
                  onChange={(e) => setQuizHeight(e.target.value)}
                  min="50"
                  max="300"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Estilo de Vida
              </h3>

              <div>
                <Label htmlFor="quiz-activity">Nível de Atividade Física *</Label>
                <Select value={quizActivityLevel} onValueChange={setQuizActivityLevel}>
                  <SelectTrigger id="quiz-activity">
                    <SelectValue placeholder="Selecione seu nível de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="leve">Levemente ativo (1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderado">Moderadamente ativo (3-5 dias/semana)</SelectItem>
                    <SelectItem value="muito-ativo">Muito ativo (6-7 dias/semana)</SelectItem>
                    <SelectItem value="extremamente-ativo">Extremamente ativo (atleta/trabalho físico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quiz-goal">Objetivo de Saúde *</Label>
                <Select value={quizHealthGoal} onValueChange={setQuizHealthGoal}>
                  <SelectTrigger id="quiz-goal">
                    <SelectValue placeholder="Selecione seu objetivo principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perder-peso">Perder peso</SelectItem>
                    <SelectItem value="ganhar-massa">Ganhar massa muscular</SelectItem>
                    <SelectItem value="manter-saude">Manter a saúde</SelectItem>
                    <SelectItem value="controlar-diabetes">Controlar diabetes</SelectItem>
                    <SelectItem value="melhorar-condicao">Melhorar condicionamento físico</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Preferências e Saúde
              </h3>

              <div>
                <Label htmlFor="quiz-diet">Preferências Alimentares</Label>
                <Select value={quizDietaryPreferences} onValueChange={setQuizDietaryPreferences}>
                  <SelectTrigger id="quiz-diet">
                    <SelectValue placeholder="Selecione suas preferências (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma restrição</SelectItem>
                    <SelectItem value="vegetariano">Vegetariano</SelectItem>
                    <SelectItem value="vegano">Vegano</SelectItem>
                    <SelectItem value="sem-gluten">Sem glúten</SelectItem>
                    <SelectItem value="sem-lactose">Sem lactose</SelectItem>
                    <SelectItem value="low-carb">Low carb</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quiz-conditions">Condições de Saúde</Label>
                <Textarea
                  id="quiz-conditions"
                  placeholder="Ex: Diabetes tipo 2, hipertensão... (opcional)"
                  value={quizHealthConditions}
                  onChange={(e) => setQuizHealthConditions(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Informe condições de saúde relevantes para melhor acompanhamento
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {userProfile ? "Atualizar Perfil" : "Começar a usar o Ozempro Play"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Visualizar Perfil */}
      <Dialog open={showProfileView} onOpenChange={setShowProfileView}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <User className="w-6 h-6 text-emerald-600" />
              Meu Perfil
            </DialogTitle>
          </DialogHeader>
          {userProfile && (
            <div className="space-y-4 mt-4">
              <Card className="bg-emerald-50 dark:bg-emerald-900/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Idade:</span>
                    <span className="font-semibold">{userProfile.age} anos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sexo:</span>
                    <span className="font-semibold capitalize">{userProfile.sex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Peso:</span>
                    <span className="font-semibold">{userProfile.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Altura:</span>
                    <span className="font-semibold">{userProfile.height} cm</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Estilo de Vida
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Atividade Física:</span>
                    <span className="font-semibold capitalize">{userProfile.activityLevel?.replace("-", " ") || "Não informado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Objetivo:</span>
                    <span className="font-semibold capitalize">{userProfile.healthGoal?.replace("-", " ") || "Não informado"}</span>
                  </div>
                </CardContent>
              </Card>

              {(userProfile.dietaryPreferences || userProfile.healthConditions) && (
                <Card className="bg-purple-50 dark:bg-purple-900/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Saúde e Preferências
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {userProfile.dietaryPreferences && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Dieta:</span>
                        <span className="font-semibold capitalize">{userProfile.dietaryPreferences.replace("-", " ")}</span>
                      </div>
                    )}
                    {userProfile.healthConditions && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block mb-1">Condições de Saúde:</span>
                        <p className="text-sm bg-white dark:bg-gray-800 p-2 rounded">{userProfile.healthConditions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleEditProfile}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Ozempro Play
            </h1>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileView(true)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Acompanhe sua alimentação e medicação
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Peso</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Alimentos</span>
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Medicação</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Sintomas</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Gráfico de Progresso de Peso */}
            {weightProgress && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                    Progresso de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Peso Inicial</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {weightProgress.initial.toFixed(1)} kg
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Peso Atual</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {weightProgress.current.toFixed(1)} kg
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Diferença</p>
                        <p className={`text-2xl font-bold ${weightProgress.diff < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {weightProgress.diff > 0 ? '+' : ''}{weightProgress.diff.toFixed(1)} kg
                        </p>
                        <p className={`text-sm ${weightProgress.diff < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ({weightProgress.percentage}%)
                        </p>
                      </div>
                    </div>
                    
                    {/* Gráfico de linha moderno */}
                    <div className="mt-6">
                      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-6 shadow-inner">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          {/* Grid horizontal */}
                          {[0, 50, 100, 150, 200].map((y) => (
                            <line
                              key={y}
                              x1="0"
                              y1={y}
                              x2="500"
                              y2={y}
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-gray-300 dark:text-gray-600"
                              strokeDasharray="5,5"
                              opacity="0.5"
                            />
                          ))}
                          
                          {/* Área preenchida sob a linha */}
                          {(() => {
                            const sorted = [...weightEntries].sort((a, b) => 
                              new Date(a.date).getTime() - new Date(b.date).getTime()
                            );
                            
                            const minWeight = Math.min(...sorted.map(e => e.weight)) - 2;
                            const maxWeight = Math.max(...sorted.map(e => e.weight)) + 2;
                            const weightRange = maxWeight - minWeight;
                            
                            const points = sorted.map((entry, index) => {
                              const x = (index / (sorted.length - 1)) * 500;
                              const y = 200 - ((entry.weight - minWeight) / weightRange) * 200;
                              return { x, y, weight: entry.weight, date: entry.date };
                            });
                            
                            const pathPoints = points.map(p => `${p.x},${p.y}`).join(' ');
                            const areaPath = `0,200 ${pathPoints} 500,200`;
                            
                            return (
                              <>
                                {/* Gradiente para área */}
                                <defs>
                                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                                  </linearGradient>
                                  <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                      <feMergeNode in="coloredBlur"/>
                                      <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                  </filter>
                                </defs>
                                
                                {/* Área preenchida */}
                                <polygon
                                  points={areaPath}
                                  fill="url(#areaGradient)"
                                />
                                
                                {/* Linha principal com efeito glow */}
                                <polyline
                                  points={pathPoints}
                                  fill="none"
                                  stroke="rgb(59, 130, 246)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#glow)"
                                />
                                
                                {/* Pontos de dados */}
                                {points.map((point, index) => (
                                  <g key={index}>
                                    {/* Círculo externo (borda branca) */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="6"
                                      fill="white"
                                      className="dark:fill-gray-800"
                                    />
                                    {/* Círculo interno (azul) */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="4"
                                      fill="rgb(59, 130, 246)"
                                      className="cursor-pointer hover:r-5 transition-all"
                                    >
                                      <title>{`${point.weight.toFixed(1)} kg - ${new Date(point.date).toLocaleDateString('pt-BR')}`}</title>
                                    </circle>
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      
                      {/* Labels de data */}
                      <div className="flex justify-between mt-3 px-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {new Date(weightEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          Hoje
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  Resumo de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Proteínas</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                      {todayTotals.protein.toFixed(1)}g
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Carboidratos</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {todayTotals.carbs.toFixed(1)}g
                    </p>
                  </div>
                  <div className="text-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Fibras</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {todayTotals.fiber.toFixed(1)}g
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Próxima Medicação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextMed ? (
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                    <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                      {nextMed.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Dose: {nextMed.dose}
                    </p>
                    <p className="text-teal-700 dark:text-teal-400 font-medium mt-2">
                      {new Date(nextMed.nextDate).toLocaleDateString("pt-BR")} às {nextMed.time}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Nenhuma medicação cadastrada
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Registrar Sintoma Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Como você está se sentindo hoje?"
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={addSymptom}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Peso */}
          <TabsContent value="weight" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Registrar Peso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="newWeight">Peso Atual (kg)</Label>
                    <Input
                      id="newWeight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 75.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={addWeight}
                    className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Histórico de Peso</CardTitle>
              </CardHeader>
              <CardContent>
                {weightEntries.length > 0 ? (
                  <div className="space-y-3">
                    {[...weightEntries]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-between"
                        >
                          {editingWeight === entry.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.1"
                                value={editWeightValue}
                                onChange={(e) => setEditWeightValue(e.target.value)}
                                className="w-32"
                              />
                              <span className="text-gray-600 dark:text-gray-300">kg</span>
                              <Button
                                size="sm"
                                onClick={() => saveEditWeight(entry.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingWeight(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                  {entry.weight.toFixed(1)} kg
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                  {new Date(entry.date).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditWeight(entry)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeWeight(entry.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhum registro de peso
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alimentos */}
          <TabsContent value="food" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Adicionar Alimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="foodName">Nome do Alimento</Label>
                  <Input
                    id="foodName"
                    placeholder="Ex: Peito de frango grelhado"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="protein">Proteínas (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="0"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carboidratos (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="0"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiber">Fibras (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      placeholder="0"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={addFood}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Alimento
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Histórico de Alimentos</CardTitle>
              </CardHeader>
              <CardContent>
                {foodEntries.length > 0 ? (
                  <div className="space-y-3">
                    {[...foodEntries]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((food) => (
                        <div
                          key={food.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          {editingFood === food.id && editFoodData ? (
                            <div className="space-y-3">
                              <Input
                                value={editFoodData.name}
                                onChange={(e) => setEditFoodData({ ...editFoodData, name: e.target.value })}
                                placeholder="Nome do alimento"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  type="number"
                                  value={editFoodData.protein}
                                  onChange={(e) => setEditFoodData({ ...editFoodData, protein: parseFloat(e.target.value) })}
                                  placeholder="Proteínas"
                                />
                                <Input
                                  type="number"
                                  value={editFoodData.carbs}
                                  onChange={(e) => setEditFoodData({ ...editFoodData, carbs: parseFloat(e.target.value) })}
                                  placeholder="Carboidratos"
                                />
                                <Input
                                  type="number"
                                  value={editFoodData.fiber}
                                  onChange={(e) => setEditFoodData({ ...editFoodData, fiber: parseFloat(e.target.value) })}
                                  placeholder="Fibras"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={saveEditFood}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingFood(null);
                                    setEditFoodData(null);
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                  {food.name}
                                </p>
                                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fiber}g</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(food.date).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditFood(food)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFood(food.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhum alimento registrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medicação */}
          <TabsContent value="medication" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Registrar Medicação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addMedication} className="space-y-4">
                  <div>
                    <Label htmlFor="medName">Nome da Medicação</Label>
                    <Input
                      id="medName"
                      placeholder="Ex: Ozempic"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medDose">Dose</Label>
                    <Input
                      id="medDose"
                      placeholder="Ex: 0.5mg"
                      value={medDose}
                      onChange={(e) => setMedDose(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medDate">Próxima Aplicação</Label>
                      <Input
                        id="medDate"
                        type="date"
                        value={medDate}
                        onChange={(e) => setMedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medTime">Horário</Label>
                      <Input
                        id="medTime"
                        type="time"
                        value={medTime}
                        onChange={(e) => setMedTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Medicação
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Medicações Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                {medications.length > 0 ? (
                  <div className="space-y-3">
                    {medications.map((med) => (
                      <div
                        key={med.id}
                        className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg"
                      >
                        {editingMed === med.id && editMedData ? (
                          <div className="space-y-3">
                            <Input
                              value={editMedData.name}
                              onChange={(e) => setEditMedData({ ...editMedData, name: e.target.value })}
                              placeholder="Nome da medicação"
                            />
                            <Input
                              value={editMedData.dose}
                              onChange={(e) => setEditMedData({ ...editMedData, dose: e.target.value })}
                              placeholder="Dose"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="date"
                                value={editMedData.nextDate}
                                onChange={(e) => setEditMedData({ ...editMedData, nextDate: e.target.value })}
                              />
                              <Input
                                type="time"
                                value={editMedData.time}
                                onChange={(e) => setEditMedData({ ...editMedData, time: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={saveEditMed}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMed(null);
                                  setEditMedData(null);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                {med.name}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300">
                                Dose: {med.dose}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-teal-700 dark:text-teal-400">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(med.nextDate).toLocaleDateString("pt-BR")} às {med.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditMed(med)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMedication(med.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhuma medicação cadastrada
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sintomas */}
          <TabsContent value="symptoms" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Registrar Sintoma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symptom">Descrição do Sintoma</Label>
                  <Textarea
                    id="symptom"
                    placeholder="Descreva como você está se sentindo..."
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={addSymptom}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Sintoma
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Histórico de Sintomas</CardTitle>
              </CardHeader>
              <CardContent>
                {symptoms.length > 0 ? (
                  <div className="space-y-3">
                    {symptoms
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((symptom) => (
                        <div
                          key={symptom.id}
                          className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                              {new Date(symptom.date).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-gray-800 dark:text-gray-100">
                              {symptom.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSymptom(symptom.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhum sintoma registrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
