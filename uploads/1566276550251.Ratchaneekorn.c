#include <stdio.h>
#include <stdlib.h>
struct struct_List{
	int count;
	struct struct_List *like;
};
struct struct_List *head;
struct node {
    int key;
    struct node * next;
};



void init(){
    head = (struct like*)malloc(sizeof(*head));
    head ->count =0;
    head ->like = NULL;
}
void insertfirst(int v,struct node *t){
    struct node * x;
    x=(struct node*)malloc(sizeof(*x));
    x -> key = v;
    x ->next =t -> next ;
    t -> next =x;
    head->count+= 1;
}
void print(struct node * t){
    printf("head");
    while(t->next!=NULL){
        printf("->%d",t->next->key);
        t=t->next;

    }
    printf("\ncount: %d",head->count);
}

int main(){
    init();insertfirst(5,head);
    insertfirst(10,head);
    insertfirst(15,head);print(head);
    printf("\n");
    return 0;
}
