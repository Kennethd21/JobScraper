import random
import numpy as np
from sklearn.naive_bayes import GaussianNB
from collections import Counter

# Move encoding
MOVE_TO_NUM = {'rock': 0, 'paper': 1, 'scissors': 2}
NUM_TO_MOVE = {0: 'rock', 1: 'paper', 2: 'scissors'}

def get_winner(player1_move, player2_move):
    """Determine the winner of a round."""
    if player1_move == player2_move:
        return 'tie'
    elif (player1_move == 'rock' and player2_move == 'scissors') or \
         (player1_move == 'paper' and player2_move == 'rock') or \
         (player1_move == 'scissors' and player2_move == 'paper'):
        return 'player1'  # User wins
    else:
        return 'player2'  # AI wins

def counter_to_move(predicted_move):
    """Choose a move that beats the predicted user move."""
    if predicted_move == 'rock':
        return 'paper'
    elif predicted_move == 'scissors':
        return 'rock'
    else:  # paper
        return 'scissors'

class MLRPSPlayer:
    def __init__(self):
        self.move_history = []  # User's move history
        self.model = GaussianNB()
        self.X = []  # Features: last 3 user moves (encoded)
        self.y = []  # Target: next user move (encoded)
        self.sequence_length = 3  # Use last 3 moves for prediction

    def update_model(self):
        """Train or retrain the model with current history."""
        if len(self.move_history) < self.sequence_length + 1:
            return

        # Prepare training data from history
        self.X = []
        self.y = []
        for i in range(self.sequence_length, len(self.move_history)):
            x_seq = [MOVE_TO_NUM[move] for move in self.move_history[i - self.sequence_length:i]]
            y = MOVE_TO_NUM[self.move_history[i]]
            self.X.append(x_seq)
            self.y.append(y)

        if len(self.X) > 0:
            self.X = np.array(self.X)
            self.y = np.array(self.y)
            self.model.fit(self.X, self.y)

    def predict_user_move(self):
        """Predict the user's next move based on history."""
        # Fallback if not enough history to train/use the model
        if len(self.move_history) < self.sequence_length + 1 or len(self.X) == 0:
            # Not enough history: fallback to most frequent or random
            if len(self.move_history) == 0:
                return random.choice(list(MOVE_TO_NUM.values()))
            else:
                counter = Counter(self.move_history)
                return counter.most_common(1)[0][0]

        # Use last sequence_length moves as input
        recent_moves = self.move_history[-self.sequence_length:]
        x_input = np.array([MOVE_TO_NUM[move] for move in recent_moves]).reshape(1, -1)
        
        pred_num = self.model.predict(x_input)[0]
        return NUM_TO_MOVE[pred_num]

    def choose_move(self):
        """AI chooses move to counter the predicted user move."""
        predicted_user = self.predict_user_move()
        return counter_to_move(predicted_user)

    def record_user_move(self, user_move):
        """Record the user's move and update the model."""
        self.move_history.append(user_move)
        self.update_model()

def play_game():
    """Main game loop."""
    ai = MLRPSPlayer()
    user_score = 0
    ai_score = 0
    ties = 0

    print("Welcome to Rock-Paper-Scissors with ML AI!")
    print("The AI will learn from your moves over time.")
    print("Enter 'rock', 'paper', or 'scissors'. Type 'quit' to exit.\n")

    while True:
        # Get user input
        user_input = input("Your move: ").lower().strip()
        if user_input == 'quit':
            break
        if user_input not in MOVE_TO_NUM:
            print("Invalid move! Please enter 'rock', 'paper', or 'scissors'.\n")
            continue

        user_move = user_input

        # AI move
        ai_move = ai.choose_move()

        # Determine winner
        winner = get_winner(user_move, ai_move)
        print(f"You played: {user_move}")
        print(f"AI played: {ai_move}")
        
        if winner == 'tie':
            print("It's a tie!\n")
            ties += 1
        elif winner == 'player1':
            print("You win this round!\n")
            user_score += 1
        else:
            print("AI wins this round!\n")
            ai_score += 1

        # Record and learn
        ai.record_user_move(user_move)

        # Show scores
        print(f"Scores - You: {user_score}, AI: {ai_score}, Ties: {ties}\n")

    print("Thanks for playing!")
    print(f"Final Scores - You: {user_score}, AI: {ai_score}, Ties: {ties}")

if __name__ == "__main__":
    play_game()
