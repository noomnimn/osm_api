#include <stdio.h>
#include <stdlib.h>
int i=0;
int j=0,count=0;
int number=1;

struct node{
    int key[10];
    struct node * next;
};
struct node * head;
void init(){
    head = (struct node*)malloc(sizeof(*head));
    head ->next = NULL;
}
void insertLast(int v ,struct node * t){
    struct node *x;
    x= (struct node*)malloc(sizeof(*x));
    x->key[i] = v;
    i++;
    while(t->next != NULL )
        t=t->next;
    if(t->next == NULL){
        t->next =x;
        x->next = NULL;
        
    }
}
void Delete (struct node *t){
    struct node *y;
    y = t->next;
    t-> next =y->next;
    free(y);
}
void print(struct node *t){
    j=count;
    printf("head");
    
    
    
    while(t->next != NULL){
        
        printf("->%d",t->next->key[j]);
        t=t->next;
        j++;
    }count++;
}
int main(){
    printf("You want delete Y: 0\n");
    init();
    while(number != 0){
        
        printf("Enter number: ");
        scanf("%d",&number);
        if(number !=0){
            insertLast(number,head);
            
        }
    }
    
    print(head);Delete(head);
    printf("\n");print(head);
    printf("\n");return 0;
}


