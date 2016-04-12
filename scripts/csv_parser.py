#!/usr/bin/env python
import csv
import sys
with open(sys.argv[1], 'rb') as csvfile:
	read = csv.reader(csvfile, delimiter=',')
	i = 0
	test_dict = {}
	for row in read:
		if(i > 1):
			for n, entry in enumerate(row):
				if entry:
					test_dict[n] = entry[0]
		i += 1
		out_str = ''
		for key, value in test_dict.iteritems():
			if(key > 0):
				if(key == 1):
					out_str += "sa"
					out_str += str(i-2)
					out_str += "= ["
				out_str += "'"
				out_str += str(key)
				out_str += value
				out_str += "'"
				if(key < 52):
					out_str += ","
				else:
					out_str += "]"

		print(out_str)
