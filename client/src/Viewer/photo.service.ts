import {Subject} from 'rxjs';
const socket: any = (window as any)['io']();
const photoStreamBehaviorSubject = new Subject<string>(); 

export const photoStream = photoStreamBehaviorSubject.asObservable()

socket.on('nextImage', (image: string) => {
    photoStreamBehaviorSubject.next(image);
})