T3App.controller('T3Ctrl', function ($scope, $timeout, T3Factory) {
    $scope.Board = ['', '', '', '', '', '', '', '', ''];
    $scope.Message = 'Your turn...';
    $scope.UserShape = 'X';
    $scope.ComputerShape = 'O';
    $scope.GameStatus = "PlayersMove";

    $scope.Difficulty = function () {
        return T3Factory.GetDifficulty();
    }

    $scope.Play = function () {
        T3Factory.Play();
        $scope.Board = T3Factory.GetBoard();
        $scope.Difficulty = T3Factory.GetDifficulty();
        $scope.UserShape = T3Factory.GetUserShape();
        $scope.ComputerShape = T3Factory.GetComputerShape();
        $scope.Message = T3Factory.GetMessage();
    };

    $scope.RegisterClick = function (cell) {
        if (T3Factory.PlaceMove(cell) === true) {
            $scope.Board = T3Factory.GetBoard();
            if (T3Factory.EvaluateWin() === true) {
                $scope.Message = T3Factory.GetMessage();
            } else {
                $scope.Message = "Computer's turn...";
                $scope.GameStatus = "Thinking";
                $timeout(function () {
                    T3Factory.ComputersTurn();
                    $scope.Message = T3Factory.GetMessage();
                    $scope.Board = T3Factory.GetBoard();
                    $scope.GameStatus = T3Factory.GetGameStatus();
                }, 700);
            }
        }
    };

    $scope.SetDifficulty = function () {
        T3Factory.SetDifficulty($scope.Difficulty);
    };
});

T3App.factory('T3Factory', function () {
    var service = {};
    var _GameStatus = "PlayersMove";
    var _Board = ['', '', '', '', '', '', '', '', ''];
    var _PossibleWinningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    var _Difficulty = 1;
    var _UserShape = 'X';
    var _ComputerShape = 'O';
    var _Message = 'Your turn...';

    service.Play = function () {
        _Board = ['', '', '', '', '', '', '', '', ''];
        _Message = 'Your turn...';
        _GameStatus = "PlayersMove";
    };

    service.PlaceMove = function (cell) {
        if ((_GameStatus === "PlayersMove") && (_Board[cell] === '')) {
            _Board[cell] = _UserShape;
            return true;
        }
        else {
            return false;
        }
    }

    service.EvaluateWin = function (cell) {
        if (EvaluateStatus(_UserShape, _Board)) {
            _GameStatus = "GameOver";
            _Message = "You Win!";
            return true;
        } else {
            return false;
        }
    };

    service.GetMessage = function () {
        return _Message;
    }

    service.GetGameStatus = function () {
        return _GameStatus;
    }

    service.GetDifficulty = function () {
        return _Difficulty;
    }

    service.SetDifficulty = function (Difficulty) {
        _Difficulty = Difficulty;
    }

    service.GetUserShape = function () {
        return _UserShape;
    };

    service.GetComputerShape = function () {
        return _ComputerShape;
    };

    service.GetBoard = function () {
        return _Board;
    }

    service.ComputersTurn = function () {
        _Board[EvaluatePossibleMoves()] = _ComputerShape;
        if (EvaluateStatus(_ComputerShape, _Board)) {
            _GameStatus = "GameOver";
            _Message = "You Lose.";
        } else {
            _GameStatus = "PlayersMove";
            if (GetPossibleMoves().length === 0) {
                _Message = "Tie Game.";
            } else {
                _Message = "Your turn...";
            }
        }
    };

    var EvaluateStatus = function (PlayerShape, BoardToEvaluate) {
        var ResultsInWin = false;
        var CombinationToEvaluate = 0;
        while (!ResultsInWin && (CombinationToEvaluate < _PossibleWinningCombinations.length)) {
            var CurrentCombination = _PossibleWinningCombinations[CombinationToEvaluate];
            if ((BoardToEvaluate[CurrentCombination[0]] === PlayerShape) && (BoardToEvaluate[CurrentCombination[1]] === PlayerShape) && (BoardToEvaluate[CurrentCombination[2]] === PlayerShape)) {
                ResultsInWin = true;
            } else {
                CombinationToEvaluate += 1;
            }
        }
        return ResultsInWin;
    };

    var GetPossibleMoves = function () {
        var PossibleMoves = [];
        for (var i = 0; i < _Board.length; i++) {
            if (_Board[i] === '') {
                PossibleMoves.push(i);
            }
        }
        return PossibleMoves;
    };

    var EvaluatePossibleMoves = function () {
        //Get Possible Moves
        var PossibleMoves = GetPossibleMoves();

        if (_Difficulty == 1) {
            //Look for wins
            for (var i = 0; i < PossibleMoves.length; i++) {
                var tempBoard = _Board.slice();
                tempBoard[PossibleMoves[i]] = _ComputerShape;
                if (EvaluateStatus(_ComputerShape, tempBoard)) {
                    return PossibleMoves[i];
                }
            }

            //Look for blocks
            for (var i = 0; i < PossibleMoves.length; i++) {
                var tempBoard = _Board.slice();
                tempBoard[PossibleMoves[i]] = _UserShape;
                if (EvaluateStatus(_UserShape, tempBoard)) {
                    return PossibleMoves[i];
                }
            }
        }

        //Random
        return PossibleMoves[Math.floor((Math.random() * PossibleMoves.length))];
    };

    return service;
});