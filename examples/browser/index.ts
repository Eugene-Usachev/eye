import {Eye} from "../../eye";

const eye = new Eye();

eye.info("Hello World with info")
eye.warn("Hello World with warn")
eye.error("Hello World with error")
eye.success("Hello World with success")
eye.ready("Hello World with ready")

const obj = {
	message: "Hello World",
	with: ""
}

eye.log({...obj, with: "log"})
eye.logInfo({...obj, with: "logInfo"})
eye.logWarn({...obj, with: "logWarn"})
eye.logError({...obj, with: "logError"})
eye.logSuccess({...obj, with: "logSuccess"})
eye.logReady({...obj, with: "logReady"})

const request = {
	method: "GET",
	endpoint: "/example",
	status: 100,
	time: 202
}

eye.fetchSend(request.endpoint, request.method)
eye.fetchGet(request.endpoint, request.method, request.status, request.time)

eye.fetchSend(request.endpoint, "POST")
eye.fetchGet(request.endpoint, "POST", 204, request.time)

eye.fetchSend(request.endpoint, "PUT")
eye.fetchGet(request.endpoint, "PUT", 304, request.time)

eye.fetchSend(request.endpoint, "PATCH")
eye.fetchGet(request.endpoint, "PATCH", 401, request.time)

eye.fetchSend(request.endpoint, "DELETE")
eye.fetchGet(request.endpoint, "DELETE", 500, request.time)