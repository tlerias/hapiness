import { test, suite, only } from 'mocha-typescript';
import * as unit from 'unit.js';
import { Socket, ServerSocket} from '../../src/core/socket';
import { HapinessModule, Hapiness, Lib, WSServer } from '../../src/core';

@suite('Socket')
class SocketTest {

    @test('ServerSocket')
    socketServer() {
        const socket = new ServerSocket({ port: 1122 });
        socket.onRequest(_ => {});
        unit.must(socket['subscribers'].length).equal(1);
        unit.must(socket.getSockets().length).equal(0);
    }

    @test('Socket')
    socket(done) {

        const socket = new Socket(null, <any>{
            on: (ev, cb) => cb(),
            sendUTF: _ => unit.must(_).equal('{"type":"event","data":"test"}'),
            close: () => done()
        }, <any>{
            getSockets: _ => [ socket ]
        });

        socket.on('test', () => {
            socket.emit('event', 'test');
            socket.emitAll('event', 'test');
            socket.close();
        });
    }
}
