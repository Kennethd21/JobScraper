#include <stdio.h>
#include <stdlib.h>

#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

int isFull()
{
    return (rear + 1) % MAX == front;
}

int isEmpty()
{
    return front == -1;
}

void enqueue(int x)
{
    if (isFull())
    {
        printf("Queue is full!\n");
        return;
    }
    if (front == -1)
        front = 0;
    rear = (rear + 1) % MAX;
    queue[rear] = x;
    printf("Enqueued: %d\n", x);
}

int dequeue()
{
    if (isEmpty())
    {
        printf("Queue is empty!\n");
        return -1;
    }
    int x = queue[front];
    if (front == rear)
    {
        front = rear = -1;
    }
    else
    {
        front = (front + 1) % MAX;
    }
    printf("Dequeued: %d\n", x);
    return x;
}

void display()
{
    if (isEmpty())
    {
        printf("Queue is empty!\n");
        return;
    }
    printf("Queue elements: ");
    int i = front;
    while (i != rear)
    {
        printf("%d ", queue[i]);
        i = (i + 1) % MAX;
    }
    printf("%d\n", queue[rear]);
}

void peek()
{
    if (isEmpty())
    {
        printf("Queue is empty!\n");
        return;
    }
    printf("Front element: %d\n", queue[front]);
}

int main()
{
    int choice, x;

    while (1)
    {
        printf("\n--- Circular Queue Menu ---\n");
        printf("1. Enqueue\n");
        printf("2. Dequeue\n");
        printf("3. Display\n");
        printf("4. Peek\n");
        printf("5. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            printf("Enter element: ");
            scanf("%d", &x);
            enqueue(x);
            break;
        case 2:
            dequeue();
            break;
        case 3:
            display();
            break;
        case 4:
            peek();
            break;
        case 5:
            exit(0);
        default:
            printf("Invalid choice!\n");
        }
    }
    return 0;
}