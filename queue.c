#include <stdio.h>

#define MAX_SIZE 100

int queue[MAX_SIZE];
int front = -1, rear = -1;

void display()
{
    if (front == -1)
    {
        printf("Queue is empty!\n");
        return;
    }
    printf("Queue: ");
    for (int i = front; i <= rear; i++)
    {
        printf("%d ", queue[i]);
    }
    printf("(Size: %d)\n", rear - front + 1);
}

void enqueue()
{
    if (rear >= MAX_SIZE - 1)
    {
        printf("Queue is full!\n");
        return;
    }
    int value;
    printf("Enter value to enqueue: ");
    scanf("%d", &value);

    if (front == -1)
    {
        front = 0;
    }
    rear++;
    queue[rear] = value;
    printf("Enqueued %d\n", value);
}

void dequeue()
{
    if (front == -1)
    {
        printf("Queue is empty!\n");
        return;
    }
    int value = queue[front];
    front++;

    if (front > rear)
    {
        front = -1;
        rear = -1;
    }
    printf("Dequeued %d\n", value);
}

void search()
{
    if (front == -1)
    {
        printf("Queue is empty!\n");
        return;
    }
    int value;
    printf("Enter value to search: ");
    scanf("%d", &value);

    for (int i = front; i <= rear; i++)
    {
        if (queue[i] == value)
        {
            printf("Value %d found at position %d\n", value, i - front);
            return;
        }
    }
    printf("Value %d not found!\n", value);
}

void peek()
{
    if (front == -1)
    {
        printf("Queue is empty!\n");
        return;
    }
    printf("Front element: %d\n", queue[front]);
}

void menu()
{
    printf("\n=== Queue Operations ===\n");
    printf("1. Enqueue\n");
    printf("2. Dequeue\n");
    printf("3. Peek\n");
    printf("4. Search\n");
    printf("5. Display\n");
    printf("6. Exit\n");
    printf("Enter choice: ");
}

int main()
{
    int choice;

    while (1)
    {
        menu();
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            enqueue();
            break;
        case 2:
            dequeue();
            break;
        case 3:
            peek();
            break;
        case 4:
            search();
            break;
        case 5:
            display();
            break;
        case 6:
            printf("Exiting...\n");
            return 0;
        default:
            printf("Invalid choice!\n");
        }
    }

    return 0;
}