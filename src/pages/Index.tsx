import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [currentScreen, setCurrentScreen] = useState("start");
  const [bombType, setBombType] = useState("normal");
  const [bombCount, setBombCount] = useState(10);
  const [clickPower, setClickPower] = useState(1);
  const [fallingBombs, setFallingBombs] = useState([]);
  const [explosions, setExplosions] = useState([]);

  const bombTypes = {
    normal: { name: "Обычная бомба", damage: 1, cost: 0, emoji: "💣" },
    mega: { name: "Мега-бомба", damage: 5, cost: 50, emoji: "🧨" },
    nuclear: { name: "Ядерная бомба", damage: 25, cost: 200, emoji: "☢️" },
  };

  const upgrades = [
    { id: "damage", name: "Усиление взрыва", cost: 30, effect: "Урон +1" },
    { id: "bombs", name: "Больше бомб", cost: 40, effect: "Количество +5" },
    { id: "autoclick", name: "Автокликер", cost: 100, effect: "Авто-атака" },
  ];

  const handleTargetClick = (e) => {
    if (bombCount <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Создаем падающую бомбу
    const newBomb = {
      id: Date.now(),
      x: x,
      y: y,
      type: bombType,
    };

    setFallingBombs((prev) => [...prev, newBomb]);
    setBombCount((prev) => prev - 1);

    // Убираем бомбу через анимацию
    setTimeout(() => {
      setFallingBombs((prev) => prev.filter((bomb) => bomb.id !== newBomb.id));

      // Создаем взрыв
      const explosion = { id: Date.now(), x: x, y: y };
      setExplosions((prev) => [...prev, explosion]);

      // Добавляем очки
      const damage = bombTypes[bombType].damage * clickPower;
      setScore((prev) => prev + damage);
      setCoins((prev) => prev + damage);

      // Убираем взрыв
      setTimeout(() => {
        setExplosions((prev) => prev.filter((exp) => exp.id !== explosion.id));
      }, 1000);
    }, 800);
  };

  const buyUpgrade = (upgradeId, cost) => {
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      if (upgradeId === "damage") setClickPower((prev) => prev + 1);
      if (upgradeId === "bombs") setBombCount((prev) => prev + 5);
    }
  };

  const buyBomb = (type) => {
    const cost = bombTypes[type].cost;
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setBombType(type);
      setBombCount((prev) => prev + 5);
    }
  };

  if (currentScreen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <Card className="relative z-10 w-96 bg-white/95 backdrop-blur-sm border-4 border-red-600 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle
              className="text-4xl font-black text-red-600 mb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              💣 BOMB CLICKER 💣
            </CardTitle>
            <p className="text-lg text-gray-700 font-medium">
              Кликай по цыганам и взрывай бомбы!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src="/img/575831c4-28e9-4fc0-9c3d-5740a26feb11.jpg"
                alt="Game Preview"
                className="w-48 h-32 object-cover rounded-lg border-2 border-orange-400"
              />
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-2">
                <span className="text-2xl">💣</span>
                <span className="text-2xl">🧨</span>
                <span className="text-2xl">☢️</span>
              </div>

              <Button
                onClick={() => setCurrentScreen("game")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-xl border-4 border-red-800 shadow-lg transform hover:scale-105 transition-all"
              >
                🚀 НАЧАТЬ ИГРУ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 text-white">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-black/30 rounded-lg p-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                💰 {coins}
              </div>
              <div className="text-sm">Монеты</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">🎯 {score}</div>
              <div className="text-sm">Очки</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {bombTypes[bombType].emoji} {bombCount}
              </div>
              <div className="text-sm">Бомбы</div>
            </div>
          </div>

          <Button
            onClick={() => setCurrentScreen("start")}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black"
          >
            <Icon name="Home" size={20} className="mr-2" />
            Главная
          </Button>
        </div>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger
              value="game"
              className="text-white data-[state=active]:bg-red-600"
            >
              🎮 Игра
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="text-white data-[state=active]:bg-blue-600"
            >
              🏪 Магазин
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Game Area */}
              <Card className="bg-black/40 border-2 border-red-500 min-h-[500px] relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold text-red-400">
                    🎯 ИГРОВОЕ ПОЛЕ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative w-full h-96 bg-gradient-to-b from-sky-400 to-green-400 rounded-lg border-4 border-yellow-500 cursor-crosshair overflow-hidden"
                    onClick={handleTargetClick}
                  >
                    {/* Background characters */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/img/575831c4-28e9-4fc0-9c3d-5740a26feb11.jpg"
                        alt="Targets"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>

                    {/* Falling bombs */}
                    {fallingBombs.map((bomb) => (
                      <div
                        key={bomb.id}
                        className="absolute text-4xl animate-bounce"
                        style={{
                          left: bomb.x - 20,
                          top: bomb.y - 20,
                          animation: "fall 0.8s ease-in forwards",
                        }}
                      >
                        {bombTypes[bomb.type].emoji}
                      </div>
                    ))}

                    {/* Explosions */}
                    {explosions.map((explosion) => (
                      <div
                        key={explosion.id}
                        className="absolute text-6xl animate-ping"
                        style={{
                          left: explosion.x - 30,
                          top: explosion.y - 30,
                        }}
                      >
                        💥
                      </div>
                    ))}

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded">
                      <p className="text-sm">Кликай по полю для атаки!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-black/40 border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold text-blue-400">
                    📊 СТАТИСТИКА
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-500/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">
                        {bombTypes[bombType].damage * clickPower}
                      </div>
                      <div className="text-sm">Урон за клик</div>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{clickPower}</div>
                      <div className="text-sm">Множитель</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-lg">Текущая бомба:</h4>
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {bombTypes[bombType].emoji}
                        </span>
                        <div>
                          <div className="font-bold">
                            {bombTypes[bombType].name}
                          </div>
                          <div className="text-sm">
                            Урон: {bombTypes[bombType].damage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bombs Shop */}
              <Card className="bg-black/40 border-2 border-yellow-500">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold text-yellow-400">
                    💣 МАГАЗИН БОМБ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(bombTypes).map(([type, bomb]) => (
                    <div key={type} className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{bomb.emoji}</span>
                          <div>
                            <div className="font-bold">{bomb.name}</div>
                            <div className="text-sm text-gray-300">
                              Урон: {bomb.damage}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {bomb.cost > 0 ? (
                            <div>
                              <div className="text-yellow-400 font-bold">
                                💰 {bomb.cost}
                              </div>
                              <Button
                                onClick={() => buyBomb(type)}
                                disabled={coins < bomb.cost}
                                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                                size="sm"
                              >
                                Купить
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="secondary">Бесплатно</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upgrades Shop */}
              <Card className="bg-black/40 border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold text-green-400">
                    ⚡ УЛУЧШЕНИЯ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className="bg-gray-800/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{upgrade.name}</div>
                          <div className="text-sm text-gray-300">
                            {upgrade.effect}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">
                            💰 {upgrade.cost}
                          </div>
                          <Button
                            onClick={() => buyUpgrade(upgrade.id, upgrade.cost)}
                            disabled={coins < upgrade.cost}
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                            size="sm"
                          >
                            Купить
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
