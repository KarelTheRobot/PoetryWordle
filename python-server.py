import gensim.downloader
import socketio
from aiohttp import web

b = gensim.downloader.load('glove-wiki-gigaword-50')

sio = socketio.AsyncServer(cors_allowed_origins="*")

app = web.Application()

sio.attach(app)

@sio.on("server_req")
def get_similarity(sid, data):
    w1 = data["all_words"]
    w2 = data["comparator"]
    d = {}
    for index, word in enumerate(w1):
        try:
            d[index] = str(b.similarity(word, w2))
        except:
            d[index] = ""
    return d

@sio.on("use_all_server_req")
def get_all_similarities(sid, data):
    print("got a request!")
    w1 = data["all_words"]
    correct_seq = data["correct_sequence"]
    comp = data["comparator"]
    use_comp = data["use_comparator"]
    print(w1)
    print(correct_seq)
    print(use_comp)

    d = {}
    if use_comp:
        for index, word in enumerate(w1):
            try:
                user_word_similarity = b.similarity(word, comp)
                correct_similarity = b.similarity(correct_seq[index], comp)
                d[index] = str(-1 * abs(user_word_similarity - correct_similarity))
            except:
                d[index] = ""
    else:
        for index, word in enumerate(w1):
            try:
                similarity = b.similarity(word, correct_seq[index])
                d[index] = str(similarity)
            except:
                d[index] = ""
    print(d)
    return d

if __name__ == '__main__':
    web.run_app(app)
