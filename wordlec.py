"""
Command-Line Wordle Game
A fully functional implementation of the popular word-guessing game Wordle.

Author: Assistant
Date: 2025
"""

import random
import sys
from typing import List, Set, Tuple

class WordleGame:
    """
    A class to represent the Wordle game with all game logic and state management.
    """
    
    def __init__(self):
        """Initialize the game with default settings."""
        self.WORD_LENGTH = 5
        self.MAX_ATTEMPTS = 6
        self.word_list = self.load_word_list()
        self.valid_words = set(self.word_list)  # For fast lookup during validation
        self.secret_word = self.select_random_word()
        self.attempts_used = 0
        self.game_over = False
        self.won = False
        self.guess_history = []

    def load_word_list(self) -> List[str]:
        """
        Load the word list. In a real implementation, this would read from a file.
        For this demo, we use a comprehensive built-in list.
        
        Returns:
            List[str]: List of valid 5-letter words in uppercase
        """
        
        try:
            with open('words.txt', 'r') as file:
                words = [line.strip().upper() for line in file if len(line.strip()) == 5]
            return words
        except FileNotFoundError:
            print("Error: words.txt file not found!")
            sys.exit(1)
        
        
        
        # Fallback word list if file is not found        
        fallback_words = [
            'APPLE', 'ABOUT', 'ZEBRA', 'CHAIR', 'TIGER', 'MOUSE', 'TABLE', 'BLAME', 'CRANE', 'FLAME',
            'BRAVE', 'CROWN ', 'DREAM', 'EAGER', 'FAITH', 'GLORY', 'HAPPY', 'IDEAL', 'JOKER', 'KNIFE',
            'LIGHT', 'MIGHT', 'NOBLE', 'OCEAN', '   PEACH', 'QUICK', 'RIVER', 'SHINE', 'TRUST', 'UNITY',
            'VIVID', 'WORLD', 'YOUTH', 'ZESTY' ] 
        return fallback_words

    def select_random_word(self) -> str:
        """
        Select a random word from the word list to be the secret word.
        
        Returns:
            str: The secret word in uppercase
        """
        return random.choice(self.word_list)

    def validate_guess(self, guess: str) -> Tuple[bool, str]:
        """
        Validate that a guess meets all requirements.
        
        Args:
            guess (str): The player's guess
            
        Returns:
            Tuple[bool, str]: (is_valid, error_message)
        """
        # Check length
        if len(guess) != self.WORD_LENGTH:
            return False, f"Guess must be exactly {self.WORD_LENGTH} letters long."
        
        # Check if only letters
        if not guess.isalpha():
            return False, "Guess must contain only letters."
        
        # Check if valid word (case-insensitive)
        if guess.upper() not in self.valid_words:
            return False, "Not a valid word. Please enter a real English word."
        
        return True, ""

    def check_guess(self, guess: str) -> List[str]:
        """
        Compare the guess to the secret word and return feedback.
        Implements proper Wordle logic handling duplicate letters correctly.
        
        Args:
            guess (str): The player's guess (will be converted to uppercase)
            
        Returns:
            List[str]: List of feedback for each letter ('CORRECT', 'PRESENT', 'ABSENT')
        """
        guess = guess.upper()
        feedback = ['ABSENT'] * self.WORD_LENGTH
        
        # Count letters in secret word for handling duplicates
        secret_letter_count = {}
        for letter in self.secret_word:
            secret_letter_count[letter] = secret_letter_count.get(letter, 0) + 1
        
        # First pass: Mark all correct letters (green)
        for i in range(self.WORD_LENGTH):
            if guess[i] == self.secret_word[i]:
                feedback[i] = 'CORRECT'
                secret_letter_count[guess[i]] -= 1
        
        # Second pass: Mark present letters (yellow)
        for i in range(self.WORD_LENGTH):
            if feedback[i] == 'ABSENT':  # Not already marked as correct
                if guess[i] in secret_letter_count and secret_letter_count[guess[i]] > 0:
                    feedback[i] = 'PRESENT'
                    secret_letter_count[guess[i]] -= 1
        
        return feedback

    def display_feedback(self, guess: str, feedback: List[str]) -> None:
        """
        Display the guess with color-coded feedback.
        
        Args:
            guess (str): The player's guess
            feedback (List[str]): Feedback for each letter
        """
        guess = guess.upper()
        display_line = ""
        symbol_line = ""
        
        for i, letter in enumerate(guess):
            display_line += f"{letter} "
            
            if feedback[i] == 'CORRECT':
                symbol_line += "🟩"
            elif feedback[i] == 'PRESENT':
                symbol_line += "🟨"
            else:  # ABSENT
                symbol_line += "⬜"
        
        print(f"{display_line}")
        print(f"{symbol_line}")
        print()

    def display_game_state(self) -> None:
        """Display the current state of the game including all previous guesses."""
        print(f"\n{'='*40}")
        print(f"WORDLE - Attempt {self.attempts_used + 1}/{self.MAX_ATTEMPTS}")
        print(f"{'='*40}")
        
        if self.guess_history:
            print("\nYour guesses so far:")
            for guess, feedback in self.guess_history:
                self.display_feedback(guess, feedback)

    def get_user_input(self) -> str:
        """
        Get and validate user input for a guess.
        
        Returns:
            str: Valid guess from user
        """
        while True:
            guess = input("Enter your guess: ").strip()
            
            if not guess:
                print("Please enter a guess.")
                continue
                
            is_valid, error_message = self.validate_guess(guess)
            if is_valid:
                return guess.upper()
            else:
                print(f"Invalid guess: {error_message}")

    def make_guess(self, guess: str) -> None:
        """
        Process a single guess and update game state.
        
        Args:
            guess (str): The player's guess
        """
        feedback = self.check_guess(guess)
        self.guess_history.append((guess, feedback))
        self.attempts_used += 1
        
        # Display the result
        print(f"\nGuess {self.attempts_used}: {guess}")
        self.display_feedback(guess, feedback)
        
        # Check win condition
        if guess == self.secret_word:
            self.won = True
            self.game_over = True
        elif self.attempts_used >= self.MAX_ATTEMPTS:
            self.game_over = True

    def display_final_result(self) -> None:
        """Display the final game result."""
        print("="*40)
        if self.won:
            print("🎉 CONGRATULATIONS! 🎉")
            print(f"You guessed the word '{self.secret_word}' in {self.attempts_used} attempt(s)!")
        else:
            print("😔 GAME OVER!")
            print(f"The word was: {self.secret_word}")
            print("Better luck next time!")
        print("="*40)

    def display_instructions(self) -> None:
        """Display the game instructions."""
        print("="*50)
        print("              WELCOME TO WORDLE!")
        print("="*50)
        print("🎯 Guess the 5-letter word in 6 attempts or fewer!")
        print("\n📝 Rules:")
        print("   • Each guess must be a valid 5-letter English word")
        print("   • After each guess, you'll get feedback:")
        print("     🟩 Green  = Correct letter in correct position")
        print("     🟨 Yellow = Letter exists but in wrong position")
        print("     ⬜ Gray   = Letter not in the word")
        print("\n💡 Tips:")
        print("   • Start with common letters (A, E, I, O, U, R, S, T)")
        print("   • Use the feedback to eliminate possibilities")
        print("   • Think about letter frequency and word patterns")
        print("="*50)

    def play(self) -> None:
        """Main game loop."""
        self.display_instructions()
        
        while not self.game_over:
            self.display_game_state()
            guess = self.get_user_input()
            self.make_guess(guess)
        
        self.display_final_result()


def ask_play_again() -> bool:
    """
    Ask the player if they want to play again.
    
    Returns:
        bool: True if player wants to play again, False otherwise
    """
    while True:
        choice = input("\nWould you like to play again? (yes/no): ").strip().lower()
        if choice in ['yes', 'y']:
            return True
        elif choice in ['no', 'n']:
            return False
        else:
            print("Please enter 'yes' or 'no'.")


def main():
    """
    Main function to run the Wordle game.
    Handles multiple game sessions and graceful exit.
    """
    print("🎮 Welcome to Command-Line Wordle! 🎮\n")
    
    try:
        while True:
            # Create and play a new game
            game = WordleGame()
            game.play()
            
            # Ask if player wants to continue
            if not ask_play_again():
                break
            
            print("\n" + "="*50 + "\n")
            print("🔄 Starting new game...\n")
    
    except KeyboardInterrupt:
        print("\n\n👋 Thanks for playing! Goodbye!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        print("Please try running the game again.")
    
    print("\n🎮 Thanks for playing Wordle! 🎮")


if __name__ == "__main__":
    main()