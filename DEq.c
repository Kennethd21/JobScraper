

#include <stdio.h>
#include <stdlib.h>

#define MAX 5

int deque[MAX];
int front = -1, rear = -1;

int isFull()
{
    return (rear + 1) % MAX == front;
}

int isEmpty()
{
    return front == -1;
}

void insertFront(int x)
{
    if (isFull())
    {
        printf("Deque is full!\n");
        return;
    }
    if (front == -1)
    {
        front = rear = 0;
    }
    else
    {
        front = (front - 1 + MAX) % MAX;
    }
    deque[front] = x;
    printf("Inserted at front: %d\n", x);
}

void insertRear(int x)
{
    if (isFull())
    {
        printf("Deque is full!\n");
        return;
    }
    if (rear == -1)
    {
        front = rear = 0;
    }
    else
    {
        rear = (rear + 1) % MAX;
    }
    deque[rear] = x;
    printf("Inserted at rear: %d\n", x);
}

int deleteFront()
{
    if (isEmpty())
    {
        printf("Deque is empty!\n");
        return -1;
    }
    int x = deque[front];
    if (front == rear)
    {
        front = rear = -1;
    }
    else
    {
        front = (front + 1) % MAX;
    }
    printf("Deleted from front: %d\n", x);
    return x;
}

int deleteRear()
{
    if (isEmpty())
    {
        printf("Deque is empty!\n");
        return -1;
    }
    int x = deque[rear];
    if (front == rear)
    {
        front = rear = -1;
    }
    else
    {
        rear = (rear - 1 + MAX) % MAX;
    }
    printf("Deleted from rear: %d\n", x);
    return x;
}

void display()
{
    if (isEmpty())
    {
        printf("Deque is empty!\n");
        return;
    }
    printf("Deque elements: ");
    int i = front;
    while (i != rear)
    {
        printf("%d ", deque[i]);
        i = (i + 1) % MAX;
    }
    printf("%d\n", deque[rear]);
}

int main()
{
    int choice, x;

    while (1)
    {
        printf("\n--- Double Ended Queue Menu ---\n");
        printf("1. Insert at Front\n");
        printf("2. Insert at Rear\n");
        printf("3. Delete from Front\n");
        printf("4. Delete from Rear\n");
        printf("5. Display\n");
        printf("6. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            printf("Enter element: ");
            scanf("%d", &x);
            insertFront(x);
            break;
        case 2:
            printf("Enter element: ");
            scanf("%d", &x);
            insertRear(x);
            break;
        case 3:
            deleteFront();
            break;
        case 4:
            deleteRear();
            break;
        case 5:
            display();
            break;
        case 6:
            exit(0);
        default:
            printf("Invalid choice!\n");
        }
    }
    return 0;
}