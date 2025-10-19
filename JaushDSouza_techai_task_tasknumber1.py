import random

# Wordle settings
WORD_LENGTH = 5
MAX_ATTEMPTS = 6

# A small fallback word list
def load_words(filename):
    with open('words.txt', "r") as f:
        words = [line.strip().lower() for line in f if len(line.strip()) == WORD_LENGTH]
    return words
WORDS= load_words('words.txt')
# pick a random word
secret_word = random.choice(WORDS)

# keep track of attempts
attempts = 0
won = False

print("Welcome to Wordle!")
print("Guess the 5-letter word. You have 6 tries.\n")

# game loop
while attempts < MAX_ATTEMPTS and not won:
    guess = input(f"Attempt {attempts+1}: ").lower().strip()

    # check length
    if len(guess) != WORD_LENGTH:
        print("Your guess must be 5 letters. Try again.\n")
        continue

    # check if in list
    if guess not in WORDS:
        print("That word is not in the list. Try again.\n")
        continue

    attempts += 1
    feedback = ["⬜"] * WORD_LENGTH
    secret_counts = {}

    # count letters in secret
    for c in secret_word:
        secret_counts[c] = secret_counts.get(c, 0) + 1

    # first check for correct letters
    for i in range(WORD_LENGTH):
        if guess[i] == secret_word[i]:
            feedback[i] = "🟩"
            secret_counts[guess[i]] -= 1

    # then check for present letters
    for i in range(WORD_LENGTH):
        if feedback[i] == "⬜" and guess[i] in secret_counts and secret_counts[guess[i]] > 0:
            feedback[i] = "🟨"
            secret_counts[guess[i]] -= 1

    # show guess with feedback
    print(" ".join(guess.upper()))
    print("".join(feedback))

    if guess == secret_word:
        won = True
        print("\nYou got it! 🎉")

if not won:
    print(f"\nOut of tries! The word was {secret_word.upper()}.")