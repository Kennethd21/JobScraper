import random
from collections import Counter

class RockPaperScissorsML:
    def __init__(self):
        # Game choices
        self.choices = ['rock', 'paper', 'scissors']
        
        # Counter mapping - what beats what
        self.counter = {
            'rock': 'paper',
            'paper': 'scissors',
            'scissors': 'rock'
        }
        
        # Store player's move history for ML
        self.history = []
        
        # Score tracking
        self.score = {'player': 0, 'ai': 0, 'ties': 0}
        
        # ML parameters
        self.window_size = 5  # How many recent moves to analyze
        self.exploitation_rate = 0.7  # 70% use learned pattern, 30% random
        
    def predict_next_move(self):
        
        if len(self.history) < 3:
            # Return random choice when we don't have enough data
            prediction = random.choice(self.choices)
            print(f"\n[ML] Cold start - not enough data. Random choice: {prediction}")
            return prediction
        
        recent_moves = self.history[-self.window_size:]
        print(f"\n[ML] Analyzing last {len(recent_moves)} moves: {recent_moves}")
        
       
        move_counts = Counter(recent_moves)
        print(f"[ML] Frequency count: {dict(move_counts)}")
        
        most_frequent = move_counts.most_common(1)[0][0]
        print(f"[ML] Most frequent player choice: {most_frequent}")
        
        
        counter_move = self.counter[most_frequent]
        print(f"[ML] Counter strategy: {counter_move}")
        
      
        if random.random() < self.exploitation_rate:
            print(f"[ML] EXPLOITING learned pattern")
            return counter_move
        else:
            random_move = random.choice(self.choices)
            print(f"[ML] EXPLORING with random move: {random_move}")
            return random_move
    
    def determine_winner(self, player_move, ai_move):
        """
        Determine who wins the round
        """
        if player_move == ai_move:
            return 'tie'
        
        # Check if player wins
        winning_conditions = {
            'rock': 'scissors',
            'paper': 'rock',
            'scissors': 'paper'
        }
        
        if winning_conditions[player_move] == ai_move:
            return 'player'
        return 'ai'
    
    def play_round(self, player_move):
        """
        Play one round of the game
        """
        # Validate input
        if player_move not in self.choices:
            return "Invalid choice! Choose rock, paper, or scissors."
        
        # AI makes prediction using ML
        ai_move = self.predict_next_move()
        
        # Determine winner
        result = self.determine_winner(player_move, ai_move)
        
        # Update score
        if result == 'player':
            self.score['player'] += 1
            outcome = "🎉 YOU WIN!"
        elif result == 'ai':
            self.score['ai'] += 1
            outcome = "🤖 AI WINS!"
        else:
            self.score['ties'] += 1
            outcome = "🤝 TIE!"
        
        # Add player's move to history for future ML predictions
        self.history.append(player_move)
        
        # Display results
        print(f"\n{'='*50}")
        print(f"You chose: {player_move.upper()}")
        print(f"AI chose: {ai_move.upper()}")
        print(f"{outcome}")
        print(f"{'='*50}")
        
        return result
    
    def show_score(self):
        """
        Display current score
        """
        print(f"\n📊 SCOREBOARD:")
        print(f"Player: {self.score['player']} | AI: {self.score['ai']} | Ties: {self.score['ties']}")
        print(f"Total games: {len(self.history)}")
       
    
    def reset(self):
        """
        Reset the game
        """
        self.history = []
        self.score = {'player': 0, 'ai': 0, 'ties': 0}
        print("\n🔄 Game reset! AI's memory cleared.")


def main():
    """
    Main game loop
    """
    game = RockPaperScissorsML()
    
    print("="*50)
    print("🤖 ROCK PAPER SCISSORS - ML Edition")
    print("="*50)
    print("The AI learns from your moves!")
    print("\nCommands:")
    print("  - Type 'rock', 'paper', or 'scissors' to play")
    print("  - Type 'score' to see current score")
    print("  - Type 'reset' to reset the game")
    print("  - Type 'quit' to exit")
    print("="*50)
    
    while True:
        user_input = input("\nYour move: ").lower().strip()
        
        if user_input == 'quit':
            print("\n👋 Thanks for playing!")
            game.show_score()
            break
        
        elif user_input == 'score':
            game.show_score()
        
        elif user_input == 'reset':
            game.reset()
        
        elif user_input in game.choices:
            game.play_round(user_input)
            game.show_score()
        
        else:
            print("❌ Invalid input! Try again.")


if __name__ == "__main__":
    main()