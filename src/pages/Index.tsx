import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerY, setPlayerY] = useState(300);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [jumpVelocity, setJumpVelocity] = useState(0);

  const GROUND_Y = 300;
  const JUMP_POWER = -15;
  const GRAVITY = 0.8;

  // Игровой цикл
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      // Обновляем позицию игрока
      setPlayerY((prev) => {
        let newY = prev + jumpVelocity;
        if (newY >= GROUND_Y) {
          newY = GROUND_Y;
          setIsJumping(false);
          setJumpVelocity(0);
        }
        return newY;
      });

      // Обновляем скорость прыжка
      setJumpVelocity((prev) => prev + GRAVITY);

      // Движение препятствий
      setObstacles((prev) => {
        const moved = prev.map((obs) => ({ ...obs, x: obs.x - gameSpeed }));
        return moved.filter((obs) => obs.x > -100);
      });

      // Увеличиваем счет
      setScore((prev) => prev + 1);

      // Увеличиваем скорость игры
      setGameSpeed((prev) => Math.min(prev + 0.005, 8));
    }, 16); // ~60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, jumpVelocity, gameSpeed]);

  // Генерация препятствий
  useEffect(() => {
    if (gameState !== "playing") return;

    const obstacleGenerator = setInterval(() => {
      if (Math.random() < 0.3) {
        const newObstacle = {
          id: Date.now(),
          x: 800,
          y: GROUND_Y - 60,
          width: 20,
          height: 60,
          type: Math.random() < 0.5 ? "single" : "double",
        };
        setObstacles((prev) => [...prev, newObstacle]);
      }
    }, 1500);

    return () => clearInterval(obstacleGenerator);
  }, [gameState]);

  // Проверка столкновений
  useEffect(() => {
    if (gameState !== "playing") return;

    const checkCollision = () => {
      const playerRect = {
        x: 100,
        y: playerY,
        width: 60,
        height: 60,
      };

      obstacles.forEach((obstacle) => {
        const obstacleRect = {
          x: obstacle.x,
          y: obstacle.y,
          width: obstacle.width,
          height: obstacle.height,
        };

        if (
          playerRect.x < obstacleRect.x + obstacleRect.width &&
          playerRect.x + playerRect.width > obstacleRect.x &&
          playerRect.y < obstacleRect.y + obstacleRect.height &&
          playerRect.y + playerRect.height > obstacleRect.y
        ) {
          gameOver();
        }
      });
    };

    checkCollision();
  }, [playerY, obstacles, gameState]);

  const jump = useCallback(() => {
    if (gameState === "playing" && !isJumping) {
      setIsJumping(true);
      setJumpVelocity(JUMP_POWER);
    }
  }, [gameState, isJumping]);

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "start" || gameState === "gameOver") {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, jump]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setPlayerY(GROUND_Y);
    setIsJumping(false);
    setJumpVelocity(0);
    setObstacles([]);
    setGameSpeed(3);
  };

  const gameOver = () => {
    setGameState("gameOver");
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Стартовый экран
  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <Card className="relative z-10 w-96 bg-white/95 backdrop-blur-sm border-4 border-purple-600 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle
              className="text-4xl font-black text-purple-600 mb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              🎮 СКЕБОБ РАННЕР 🎮
            </CardTitle>
            <p className="text-lg text-gray-700 font-medium">
              Перепрыгивай через провода и беги!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src="/img/045335f0-dd3d-477f-ad2f-077a45102224.jpg"
                alt="СКЕБОБ"
                className="w-48 h-32 object-cover rounded-lg border-2 border-purple-400"
              />
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-2">
                <span className="text-2xl">🎮</span>
                <span className="text-2xl">⚡</span>
                <span className="text-2xl">🏃</span>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>Нажми ПРОБЕЛ или кликни для прыжка</p>
                <p>Рекорд: {highScore}</p>
              </div>

              <Button
                onClick={startGame}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 text-xl border-4 border-purple-700 shadow-lg transform hover:scale-105 transition-all"
              >
                🚀 НАЧАТЬ ИГРУ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Экран Game Over
  if (gameState === "gameOver") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <Card className="relative z-10 w-96 bg-white/95 backdrop-blur-sm border-4 border-red-600 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle
              className="text-4xl font-black text-red-600 mb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              💥 GAME OVER 💥
            </CardTitle>
            <p className="text-lg text-gray-700 font-medium">
              СКЕБОБ попал в провода!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                Счет: {score}
              </div>
              <div className="text-xl font-bold text-purple-600">
                Рекорд: {highScore}
              </div>

              {score === highScore && score > 0 && (
                <div className="text-yellow-600 font-bold animate-pulse">
                  🏆 НОВЫЙ РЕКОРД! 🏆
                </div>
              )}
            </div>

            <div className="text-center space-y-3">
              <Button
                onClick={startGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-xl border-4 border-green-800 shadow-lg transform hover:scale-105 transition-all"
              >
                🔄 ИГРАТЬ СНОВА
              </Button>

              <Button
                onClick={() => setGameState("start")}
                variant="outline"
                className="w-full border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
              >
                🏠 В ГЛАВНОЕ МЕНЮ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Игровой экран
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-purple-800 relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-purple-900 opacity-80"></div>

      {/* Летающие элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full opacity-60 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Игровое поле */}
      <div className="relative z-10 w-full h-screen">
        {/* Интерфейс */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 text-white px-4 py-2 rounded-lg font-bold text-xl">
            Счет: {score}
          </div>
          <div className="bg-black/50 text-white px-4 py-2 rounded-lg font-bold">
            Рекорд: {highScore}
          </div>
        </div>

        {/* Земля */}
        <div
          className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-gray-600 to-gray-400 border-t-4 border-gray-700"
          style={{ top: `${GROUND_Y + 60}px` }}
        />

        {/* СКЕБОБ */}
        <div
          className="absolute transition-all duration-100"
          style={{
            left: "100px",
            top: `${playerY}px`,
            transform: isJumping ? "rotate(-10deg)" : "rotate(0deg)",
          }}
        >
          <img
            src="/img/045335f0-dd3d-477f-ad2f-077a45102224.jpg"
            alt="СКЕБОБ"
            className="w-16 h-16 object-cover rounded-lg border-4 border-purple-600 shadow-lg"
            style={{
              filter: isJumping ? "brightness(1.2)" : "brightness(1)",
            }}
          />
        </div>

        {/* Препятствия - провода */}
        {obstacles.map((obstacle) => (
          <div key={obstacle.id}>
            {/* Провод */}
            <div
              className="absolute bg-gray-800 border-2 border-gray-600 shadow-lg"
              style={{
                left: `${obstacle.x}px`,
                top: `${obstacle.y}px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
              }}
            />
            {/* Электрические искры */}
            <div
              className="absolute text-yellow-400 text-2xl animate-pulse"
              style={{
                left: `${obstacle.x - 10}px`,
                top: `${obstacle.y - 10}px`,
              }}
            >
              ⚡
            </div>
            {obstacle.type === "double" && (
              <>
                <div
                  className="absolute bg-gray-800 border-2 border-gray-600 shadow-lg"
                  style={{
                    left: `${obstacle.x + 30}px`,
                    top: `${obstacle.y - 20}px`,
                    width: `${obstacle.width}px`,
                    height: `${obstacle.height + 20}px`,
                  }}
                />
                <div
                  className="absolute text-yellow-400 text-2xl animate-pulse"
                  style={{
                    left: `${obstacle.x + 20}px`,
                    top: `${obstacle.y - 30}px`,
                  }}
                >
                  ⚡
                </div>
              </>
            )}
          </div>
        ))}

        {/* Инструкции */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-center">
          <p className="text-sm">ПРОБЕЛ или КЛИК для прыжка</p>
        </div>

        {/* Кнопка прыжка для мобильных */}
        <Button
          onClick={jump}
          className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500 hover:bg-purple-600 text-white font-bold text-2xl border-4 border-purple-700 shadow-lg rounded-full"
        >
          ⬆️
        </Button>
      </div>
    </div>
  );
};

export default Index;
