package main

import (
	"flag"
	"log"

	"github.com/sathwikshetty33/PatchForge/api"
)

func main() {
	var addr string
	flag.StringVar(&addr, "addr", ":8080", "HTTP network address")
	flag.Parse()
	server := api.NewServer()

	log.Printf("Starting server on %s", addr)
	if err := server.Router.Run(addr); err != nil {
		log.Fatalf("Could not start server: %v\n", err)
	}		
	}
